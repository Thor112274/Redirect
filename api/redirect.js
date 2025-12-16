export default function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    res.status(400).send("Invalid redirect URL");
    return;
  }

  res.setHeader("Content-Type", "text/html");

  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="refresh" content="0;url=${url}">
        <title>Redirecting...</title>
      </head>
      <body>
        <p>Redirecting, please wait...</p>
      </body>
    </html>
  `);
}
