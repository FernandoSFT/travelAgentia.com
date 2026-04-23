#!/usr/bin/env python3
"""Submit a search query to an authenticated site and return cleaned HTML."""

import argparse
import json
import os
import sys
from pathlib import Path

import httpx
from bs4 import BeautifulSoup
from dotenv import load_dotenv

SESSION_DIR = Path("/tmp")
MAX_CHARS = 50_000


def session_path(key: str) -> Path:
    return SESSION_DIR / f"claude-session-{key}.json"


def load_cookies(key: str) -> dict:
    path = session_path(key)
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text())
    except Exception:
        return {}


def clean_html(html: str) -> str:
    soup = BeautifulSoup(html, "lxml")
    for tag in soup.find_all(["script", "style", "svg", "noscript", "iframe"]):
        tag.decompose()
    text = str(soup)
    if len(text) > MAX_CHARS:
        text = text[:MAX_CHARS] + "\n<!-- TRUNCATED -->"
    return text


def resolve_url(site_key: str, url: str) -> str:
    if url.startswith("http"):
        return url
    for n in range(1, 20):
        prefix = f"SITE{n}_"
        k = os.getenv(f"{prefix}KEY", "")
        if k.lower() == site_key.lower():
            base = os.getenv(f"{prefix}BASE_URL", "").rstrip("/")
            return base + ("" if url.startswith("/") else "/") + url
    return url


def main() -> None:
    load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

    parser = argparse.ArgumentParser()
    parser.add_argument("--site", required=True)
    parser.add_argument("--url", required=True, help="Search endpoint URL or relative path")
    parser.add_argument("--query", required=True, help="Search query string")
    parser.add_argument(
        "--method",
        choices=["get", "post", "form_post"],
        default="get",
        help="HTTP method: get (query param), post (JSON body), form_post (form data)",
    )
    parser.add_argument(
        "--param-name",
        default="q",
        help="URL/body parameter name for the query (default: q)",
    )
    parser.add_argument(
        "--extra-params",
        default="{}",
        help="Additional params as JSON object, merged with query param",
    )
    args = parser.parse_args()

    cookies = load_cookies(args.site)
    if not cookies:
        print(f"<!-- WARNING: no session for '{args.site}'. Run login.py first. -->", file=sys.stderr)

    full_url = resolve_url(args.site, args.url)

    try:
        extra = json.loads(args.extra_params)
    except Exception:
        extra = {}

    payload = {args.param_name: args.query, **extra}

    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
    }

    try:
        with httpx.Client(cookies=cookies, headers=headers, follow_redirects=True, timeout=30) as client:
            if args.method == "get":
                r = client.get(full_url, params=payload)
            elif args.method == "post":
                r = client.post(full_url, json=payload)
            else:  # form_post
                r = client.post(full_url, data=payload)
        print(clean_html(r.text))
    except Exception as e:
        print(f"<!-- ERROR: {e} -->", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
