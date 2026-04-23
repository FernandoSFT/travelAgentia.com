#!/usr/bin/env python3
"""Parse HTML (from stdin or file) and extract structured data: text, tables, links."""

import argparse
import json
import sys

from bs4 import BeautifulSoup


def extract_tables(soup: BeautifulSoup) -> list[list[dict]]:
    tables = []
    for table in soup.find_all("table"):
        headers = [th.get_text(strip=True) for th in table.find_all("th")]
        rows = []
        for tr in table.find_all("tr"):
            cells = [td.get_text(strip=True) for td in tr.find_all("td")]
            if not cells:
                continue
            if headers and len(cells) == len(headers):
                rows.append(dict(zip(headers, cells)))
            else:
                rows.append(cells)
        if rows:
            tables.append(rows)
    return tables


def extract_links(soup: BeautifulSoup) -> list[dict]:
    links = []
    for a in soup.find_all("a", href=True):
        text = a.get_text(strip=True)
        href = a["href"]
        if text and href and not href.startswith(("#", "javascript:")):
            links.append({"text": text, "href": href})
    return links[:100]


def extract_text(soup: BeautifulSoup) -> str:
    for tag in soup.find_all(["script", "style", "svg", "noscript"]):
        tag.decompose()
    lines = [line.strip() for line in soup.get_text(separator="\n").splitlines()]
    lines = [line for line in lines if line]
    return "\n".join(lines)[:8_000]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", help="Path to HTML file (default: read from stdin)")
    parser.add_argument("--instructions", default="", help="Extraction hint (passed through to output for Claude)")
    args = parser.parse_args()

    if args.file:
        with open(args.file, encoding="utf-8", errors="replace") as f:
            html = f.read()
    else:
        html = sys.stdin.read()

    soup = BeautifulSoup(html, "lxml")

    result = {
        "instructions": args.instructions,
        "text": extract_text(soup),
        "tables": extract_tables(soup),
        "links": extract_links(soup),
    }

    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
