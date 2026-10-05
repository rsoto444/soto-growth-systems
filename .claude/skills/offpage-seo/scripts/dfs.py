#!/usr/bin/env python3
"""Minimal DataForSEO REST client with 30-day caching and cost logging.

Usage:
  python dfs.py <domain> <endpoint_path> '<json task object>'
Example:
  python dfs.py example.com backlinks/summary/live '{"target":"example.com"}'

Reads DATAFORSEO_USERNAME / DATAFORSEO_PASSWORD from env. Never hardcode them.
"""
import base64, datetime as dt, json, os, pathlib, sys, time, urllib.request

BASE = "https://api.dataforseo.com/v3/"
CACHE_DAYS = 30


def call(domain: str, path: str, task: dict) -> dict:
    raw_dir = pathlib.Path("offpage") / domain / "raw"
    raw_dir.mkdir(parents=True, exist_ok=True)
    slug = path.strip("/").replace("/", "_")
    today = dt.date.today()

    # Reuse any cached response with identical task within CACHE_DAYS
    for f in sorted(raw_dir.glob(f"{slug}_*.json"), reverse=True):
        data = json.loads(f.read_text())
        age = (today - dt.date.fromisoformat(data["_date"])).days
        if age <= CACHE_DAYS and data["_task"] == task:
            print(f"[cache] {f.name} ({age}d old)", file=sys.stderr)
            return data["response"]

    user = os.environ.get("DATAFORSEO_USERNAME") or os.environ["DATAFORSEO_LOGIN"]  # this repo's .env uses DATAFORSEO_LOGIN
    pwd = os.environ["DATAFORSEO_PASSWORD"]
    token = base64.b64encode(f"{user}:{pwd}".encode()).decode()
    req = urllib.request.Request(
        BASE + path.strip("/"),
        data=json.dumps([task]).encode(),
        headers={"Authorization": f"Basic {token}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        resp = json.loads(r.read())

    out = raw_dir / f"{slug}_{today.isoformat()}_{int(time.time())}.json"
    out.write_text(json.dumps({"_date": today.isoformat(), "_task": task, "response": resp}, indent=2))

    cost = resp.get("cost", 0)
    with open(pathlib.Path("offpage") / domain / "cost-log.csv", "a") as log:
        log.write(f"{dt.datetime.now().isoformat()},{path},{cost}\n")
    print(f"[api] {path} cost=${cost}", file=sys.stderr)
    return resp


if __name__ == "__main__":
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    print(json.dumps(call(sys.argv[1], sys.argv[2], json.loads(sys.argv[3])), indent=2))
