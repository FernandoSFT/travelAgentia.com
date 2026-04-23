#!/usr/bin/env python3
"""Authenticate to a registered site and persist cookies to /tmp."""

import argparse
import json
import os
import sys
from pathlib import Path

import httpx
from bs4 import BeautifulSoup
from dotenv import load_dotenv

SESSION_DIR = Path("/tmp")


def load_site_config(key: str) -> dict:
    """Find SITE{N}_ vars in environment where SITE{N}_KEY == key."""
    for n in range(1, 20):
        prefix = f"SITE{n}_"
        site_key = os.getenv(f"{prefix}KEY", "")
        if site_key.lower() == key.lower():
            return {
                "key": site_key,
                "base_url": os.getenv(f"{prefix}BASE_URL", ""),
                "login_url": os.getenv(f"{prefix}LOGIN_URL", ""),
                "username": os.getenv(f"{prefix}USERNAME", ""),
                "password": os.getenv(f"{prefix}PASSWORD", ""),
                "username_field": os.getenv(f"{prefix}USERNAME_FIELD", "username"),
                "password_field": os.getenv(f"{prefix}PASSWORD_FIELD", "password"),
            }
    return {}


def session_path(key: str) -> Path:
    return SESSION_DIR / f"claude-session-{key}.json"


def save_cookies(key: str, cookies: dict) -> None:
    session_path(key).write_text(json.dumps(cookies))


def extract_hidden_fields(html: str) -> dict:
    soup = BeautifulSoup(html, "lxml")
    fields = {}
    for tag in soup.find_all("input", type="hidden"):
        name = tag.get("name")
        value = tag.get("value", "")
        if name:
            fields[name] = value
    return fields


def main() -> None:
    load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

    parser = argparse.ArgumentParser()
    parser.add_argument("--site", required=True, help="Site key (e.g. portal1)")
    args = parser.parse_args()

    cfg = load_site_config(args.site)
    if not cfg:
        print(json.dumps({"success": False, "message": f"Site '{args.site}' not found in .env"}))
        sys.exit(1)

    if not cfg["login_url"]:
        print(json.dumps({"success": False, "message": "LOGIN_URL not configured"}))
        sys.exit(1)

    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }

    with httpx.Client(headers=headers, follow_redirects=True, timeout=30) as client:
        # GET login page to capture CSRF tokens and hidden fields
        try:
            r = client.get(cfg["login_url"])
        except Exception as e:
            print(json.dumps({"success": False, "message": f"Cannot reach login page: {e}"}))
            sys.exit(1)

        hidden = extract_hidden_fields(r.text)
        post_data = {
            **hidden,
            cfg["username_field"]: cfg["username"],
            cfg["password_field"]: cfg["password"],
        }

        # POST credentials
        try:
            r2 = client.post(cfg["login_url"], data=post_data)
        except Exception as e:
            print(json.dumps({"success": False, "message": f"Login POST failed: {e}"}))
            sys.exit(1)

        cookies = dict(client.cookies)
        save_cookies(args.site, cookies)

        # Heuristic: if we ended up on the login page again, auth probably failed
        login_failed = any(
            term in r2.url.path.lower() for term in ["login", "signin", "auth"]
        ) and r2.status_code == 200 and len(cookies) == 0

        if login_failed:
            print(json.dumps({
                "success": False,
                "cookies": len(cookies),
                "message": "Login seems to have failed — still on login page with no cookies",
            }))
        else:
            print(json.dumps({
                "success": True,
                "cookies": len(cookies),
                "message": f"Authenticated to '{args.site}'. {len(cookies)} cookie(s) saved.",
            }))


if __name__ == "__main__":
    main()
