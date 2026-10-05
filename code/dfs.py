"""Tiny DataForSEO helper for the SGS keyword run. Reads the login from the repo's .env."""
import json
import subprocess

import pathlib
ENV = dict(l.strip().split("=", 1) for l in open(pathlib.Path(__file__).resolve().parent.parent / ".env") if "=" in l)
AUTH = ENV["DATAFORSEO_LOGIN"] + ":" + ENV["DATAFORSEO_PASSWORD"]


def post(path, payload):
    r = subprocess.run(
        ["curl", "-s", "-m", "180", "-u", AUTH, "-H", "Content-Type: application/json",
         "-d", json.dumps(payload), "https://api.dataforseo.com/v3/" + path],
        capture_output=True, text=True,
    )
    d = json.loads(r.stdout)
    if d.get("status_code") != 20000:
        raise SystemExit(f"{path}: {d.get('status_message')}")
    t = d["tasks"][0]
    if t.get("status_code") != 20000:
        raise SystemExit(f"{path} task: {t.get('status_message')}")
    return t, d.get("cost")
