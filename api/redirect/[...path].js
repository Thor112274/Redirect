from flask import Flask, request, redirect, abort
import cloudscraper

from Thunder.utils.token_store import resolve_token, delete_token

app = Flask(__name__)

@app.route("/api/redirect/<path:any_path>")
def redirect_handler(any_path):
    token = request.args.get("token")
    if not token:
        abort(403)

    short_url = resolve_token(token)
    if not short_url:
        return "Token expired or invalid", 403

    # Optional: one-time token
    delete_token(token)

    # Optional: block bots
    ua = request.headers.get("User-Agent", "").lower()
    if not ua or "bot" in ua:
        abort(403)

    scraper = cloudscraper.create_scraper()
    r = scraper.get(short_url, allow_redirects=True)

    return redirect(r.url, code=302)
