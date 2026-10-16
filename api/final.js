// Función serverless de Vercel: GET /api/final
// Entrega la cuenta regresiva, las pistas que ya tocan y, SOLO cuando llega la hora, la carta.
const { buildPayload } = require("../shared/final.cjs");

module.exports = function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const preview = typeof req.query?.preview === "string" ? req.query.preview : "";
    return res.json(buildPayload(preview));
  } catch (err) {
    console.error("final:", err.message);
    return res.status(500).json({ success: false, message: "La puerta no responde por ahora." });
  }
};
