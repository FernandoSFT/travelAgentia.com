#!/usr/bin/env python3
"""
Manage routing memory: which providers work best for which destinations/types.

Actions:
  recommend  --destination STR --type STR
  update     --destination STR --type STR --result JSON
  add-note   --provider STR --note STR [--strong-for STR] [--weak-for STR]
  show
"""

import argparse
import json
import sys
from datetime import date
from pathlib import Path

MEMORY_FILE = Path(__file__).parent.parent / "memory" / "routing.json"

EMPTY_MEMORY = {
    "provider_profiles": {},
    "routing_rules": [],
    "search_history": [],
}


def load() -> dict:
    if not MEMORY_FILE.exists():
        return EMPTY_MEMORY.copy()
    try:
        return json.loads(MEMORY_FILE.read_text())
    except Exception:
        return EMPTY_MEMORY.copy()


def save(mem: dict) -> None:
    MEMORY_FILE.parent.mkdir(parents=True, exist_ok=True)
    MEMORY_FILE.write_text(json.dumps(mem, ensure_ascii=False, indent=2))


# ---------------------------------------------------------------------------
# recommend
# ---------------------------------------------------------------------------

def _keywords_match(keywords: list[str], text: str) -> bool:
    text_lower = text.lower()
    return any(kw.lower() in text_lower for kw in keywords)


def cmd_recommend(destination: str, trip_type: str) -> None:
    mem = load()
    all_providers = list(mem["provider_profiles"].keys())

    priority: list[str] = []
    skip: list[str] = []
    reasons: list[str] = []

    for rule in mem["routing_rules"]:
        cond = rule.get("condition", {})
        dest_kws = cond.get("destination_keywords", [])
        type_kws = cond.get("type_keywords", [])

        dest_match = _keywords_match(dest_kws, destination) if dest_kws else True
        type_match = _keywords_match(type_kws, trip_type) if type_kws else True

        if dest_match and type_match:
            for p in rule.get("priority_providers", []):
                if p not in priority:
                    priority.append(p)
            for p in rule.get("skip_providers", []):
                if p not in skip:
                    skip.append(p)
            searches = rule.get("based_on_searches", 0)
            if dest_kws:
                reasons.append(
                    f"Regla aprendida en {searches} búsquedas: "
                    f"destinos {dest_kws} → priorizar {rule.get('priority_providers', [])}"
                )

    # Providers not in priority and not skipped go to the end
    neutral = [p for p in all_providers if p not in priority and p not in skip]

    result = {
        "priority": priority,
        "neutral": neutral,
        "skip": skip,
        "reason": " | ".join(reasons) if reasons else "Sin reglas aprendidas aún — probar todos los proveedores",
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


# ---------------------------------------------------------------------------
# update
# ---------------------------------------------------------------------------

def cmd_update(destination: str, trip_type: str, result_json: str) -> None:
    mem = load()

    try:
        results: dict[str, str] = json.loads(result_json)
    except Exception:
        print(json.dumps({"error": "Invalid --result JSON"}))
        sys.exit(1)

    entry = {
        "date": date.today().isoformat(),
        "destination": destination,
        "trip_type": trip_type,
        "providers_results": results,
        "best_provider": _best(results),
    }
    mem["search_history"].append(entry)

    # Update provider profiles
    for provider, quality in results.items():
        profile = mem["provider_profiles"].setdefault(provider, {
            "strong_for": {"destinations": [], "trip_types": []},
            "weak_for": {"destinations": [], "trip_types": []},
            "notes": "",
            "last_updated": "",
        })
        profile["last_updated"] = date.today().isoformat()

        if quality in ("excellent", "good"):
            if destination not in profile["strong_for"]["destinations"]:
                profile["strong_for"]["destinations"].append(destination)
            if trip_type not in profile["strong_for"]["trip_types"]:
                profile["strong_for"]["trip_types"].append(trip_type)
        elif quality in ("poor", "not_found", "bad"):
            if destination not in profile["weak_for"]["destinations"]:
                profile["weak_for"]["destinations"].append(destination)
            if trip_type not in profile["weak_for"]["trip_types"]:
                profile["weak_for"]["trip_types"].append(trip_type)

    # Auto-generate routing rules when ≥3 searches share the same pattern
    _maybe_create_rule(mem, destination, trip_type)

    save(mem)
    best = entry["best_provider"]
    print(json.dumps({
        "saved": True,
        "best_provider": best,
        "message": f"Memoria actualizada. Mejor proveedor para '{destination}' ({trip_type}): {best}",
    }, ensure_ascii=False))


def _best(results: dict) -> str:
    order = ["excellent", "good", "ok", "poor", "bad", "not_found"]
    for quality in order:
        for provider, q in results.items():
            if q == quality:
                return provider
    return list(results.keys())[0] if results else ""


def _maybe_create_rule(mem: dict, destination: str, trip_type: str) -> None:
    """Create or reinforce a routing_rule when a pattern repeats ≥3 times."""
    history = mem["search_history"]

    # Count matching entries for this destination keyword
    dest_word = destination.split()[0]  # first word as keyword
    matching = [
        e for e in history
        if dest_word.lower() in e["destination"].lower()
        and e.get("best_provider")
    ]

    if len(matching) < 3:
        return

    # Tally best providers
    tally: dict[str, int] = {}
    worst: dict[str, int] = {}
    for e in matching:
        best = e.get("best_provider", "")
        if best:
            tally[best] = tally.get(best, 0) + 1
        for p, q in e.get("providers_results", {}).items():
            if q in ("not_found", "bad", "poor"):
                worst[p] = worst.get(p, 0) + 1

    if not tally:
        return

    top_provider = max(tally, key=lambda p: tally[p])
    consistent_skip = [p for p, c in worst.items() if c >= 3]

    # Check if a rule for this keyword already exists
    existing = next(
        (r for r in mem["routing_rules"]
         if dest_word.lower() in [kw.lower() for kw in r.get("condition", {}).get("destination_keywords", [])]),
        None,
    )

    if existing:
        if top_provider not in existing["priority_providers"]:
            existing["priority_providers"].insert(0, top_provider)
        for p in consistent_skip:
            if p not in existing["skip_providers"]:
                existing["skip_providers"].append(p)
        existing["based_on_searches"] = len(matching)
        existing["confidence"] = min(0.95, 0.5 + len(matching) * 0.05)
    else:
        mem["routing_rules"].append({
            "condition": {"destination_keywords": [dest_word, destination]},
            "priority_providers": [top_provider],
            "skip_providers": consistent_skip,
            "confidence": min(0.95, 0.5 + len(matching) * 0.05),
            "based_on_searches": len(matching),
        })


# ---------------------------------------------------------------------------
# add-note
# ---------------------------------------------------------------------------

def cmd_add_note(provider: str, note: str, strong_for: str, weak_for: str) -> None:
    mem = load()
    profile = mem["provider_profiles"].setdefault(provider, {
        "strong_for": {"destinations": [], "trip_types": []},
        "weak_for": {"destinations": [], "trip_types": []},
        "notes": "",
        "last_updated": "",
    })
    profile["notes"] = (profile.get("notes", "") + " | " + note).strip(" |")
    profile["last_updated"] = date.today().isoformat()

    if strong_for:
        for item in [x.strip() for x in strong_for.split(",")]:
            if item not in profile["strong_for"]["destinations"]:
                profile["strong_for"]["destinations"].append(item)

    if weak_for:
        for item in [x.strip() for x in weak_for.split(",")]:
            if item not in profile["weak_for"]["destinations"]:
                profile["weak_for"]["destinations"].append(item)

    save(mem)
    print(json.dumps({"saved": True, "provider": provider, "note": note}, ensure_ascii=False))


# ---------------------------------------------------------------------------
# show
# ---------------------------------------------------------------------------

def cmd_show() -> None:
    mem = load()

    profiles = mem.get("provider_profiles", {})
    rules = mem.get("routing_rules", [])
    history = mem.get("search_history", [])

    lines = ["# Resumen de memoria del agente", ""]

    lines.append(f"## Proveedores conocidos ({len(profiles)})")
    for name, p in profiles.items():
        strong = p.get("strong_for", {}).get("destinations", [])
        weak = p.get("weak_for", {}).get("destinations", [])
        notes = p.get("notes", "")
        lines.append(f"- **{name}**: fuerte en {strong} | débil en {weak}")
        if notes:
            lines.append(f"  Notas: {notes}")

    lines.append(f"\n## Reglas de routing aprendidas ({len(rules)})")
    for r in rules:
        cond = r.get("condition", {})
        kws = cond.get("destination_keywords", [])
        prio = r.get("priority_providers", [])
        skip = r.get("skip_providers", [])
        searches = r.get("based_on_searches", 0)
        conf = r.get("confidence", 0)
        lines.append(
            f"- Destinos {kws}: priorizar {prio}, omitir {skip} "
            f"(confianza {conf:.0%}, basado en {searches} búsquedas)"
        )

    lines.append(f"\n## Historial de búsquedas ({len(history)} entradas)")
    for e in history[-10:]:  # last 10
        lines.append(
            f"- [{e.get('date','')}] {e.get('destination','')} / {e.get('trip_type','')} "
            f"→ mejor: {e.get('best_provider','?')}"
        )
    if len(history) > 10:
        lines.append(f"  ... y {len(history) - 10} más anteriores")

    print("\n".join(lines))


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Agent routing memory manager")
    parser.add_argument("--action", required=True, choices=["recommend", "update", "add-note", "show"])
    parser.add_argument("--destination", default="")
    parser.add_argument("--type", dest="trip_type", default="")
    parser.add_argument("--result", default="{}", help="JSON: {provider: quality}")
    parser.add_argument("--provider", default="")
    parser.add_argument("--note", default="")
    parser.add_argument("--strong-for", default="")
    parser.add_argument("--weak-for", default="")
    args = parser.parse_args()

    if args.action == "recommend":
        if not args.destination:
            print(json.dumps({"error": "--destination required"}))
            sys.exit(1)
        cmd_recommend(args.destination, args.trip_type)

    elif args.action == "update":
        if not args.destination:
            print(json.dumps({"error": "--destination required"}))
            sys.exit(1)
        cmd_update(args.destination, args.trip_type, args.result)

    elif args.action == "add-note":
        if not args.provider:
            print(json.dumps({"error": "--provider required"}))
            sys.exit(1)
        cmd_add_note(args.provider, args.note, args.strong_for, args.weak_for)

    elif args.action == "show":
        cmd_show()


if __name__ == "__main__":
    main()
