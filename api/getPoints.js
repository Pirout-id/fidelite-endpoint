import fetch from "node-fetch";

export default async function handler(req, res) {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ error: "Email manquant" });
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = "Untitled Base";

  // Filtre en minuscule pour éviter les erreurs de casse
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?filterByFormula=LOWER({Email})='${email.toLowerCase()}'`;

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
      recompense: client["Récompenses"] || null
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
