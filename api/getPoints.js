export default async function handler(req, res) {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: "Email manquant" });
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = "Untitled Base";

  const url = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=({Email}='${email}')`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    const data = await response.json();

    if (!data.records || data.records.length === 0) {
      return res.status(404).json({ error: "Client introuvable" });
    }

    const client = data.records[0].fields;

    return res.status(200).json({
      nom: client.Nom,
      points: client.Points,
      recompense: client.Recompense || null
    });

  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
