import crypto from "crypto";
import { Buffer } from "buffer";
import Fernet from "fernet";

// 🔑 SAME KEY AS BOT (base64)
const FERNET_KEY = "PASTE_YOUR_FERNET_KEY_HERE";

const secret = new Fernet.Secret(FERNET_KEY);

export default function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(403).send("Invalid Token");
  }

  try {
    const fernet = new Fernet.Token({
      secret,
      token,
      ttl: 0
    });

    const decoded = fernet.decode();
    const payload = JSON.parse(decoded);

    if (Date.now() / 1000 > payload.exp) {
      return res.status(403).send("Token Expired");
    }

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="refresh" content="0;url=${payload.url}">
          <title>Redirecting...</title>
        </head>
        <body>
          <p>Redirecting, please wait...</p>
        </body>
      </html>
    `);

  } catch (e) {
    return res.status(403).send("Invalid Token");
  }
}
