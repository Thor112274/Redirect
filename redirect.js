export default function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    res.status(400).send("Invalid redirect URL");
    return;
  }

  res.writeHead(302, {
    Location: url
  });
  res.end();
}
