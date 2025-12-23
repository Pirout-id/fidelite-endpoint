export default async function handler(req, res) {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: "Email manquant" });
  }

  // Variables d'environnement (à mettre dans Vercel)
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = "appL0sl8l505Gn5XI";  // ton Base ID
  const tableName = "Untitled Base";    // le nom exact de ta table dans Airtable

  // URL Airtable avec filtre insensible à la casse
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?filterByFormula=LOWER({Email})='${email.toLowerCase()}'`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    const data = await response.json();

    // Affiche la réponse dans les logs pour debug
    console.log("Airtable response:", data);

    if (!data.records || data.records.length === 0) {
      return res.status(404).json({ error: "Client introuvable" });
    }

    const client = data.records[0].fields;

    return res.status(200).json({
      nom: client.Nom
