export default function handler(req, res) {
  const { token } = req.query;

  // basic validation
  if (!token) {
    return res.status(400).send("Missing token");
  }

  // TEMP TEST (replace later with DB or API)
  // For now, just show token to confirm function works
  res.status(200).send(`
    <html>
      <body>
        <h3>Redirect token received</h3>
        <p>${token}</p>
      </body>
    </html>
  `);
}
