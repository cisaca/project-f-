// Función serverless de Vercel: POST /api/unlock
// Las fechas válidas viven SOLO en variables de entorno (VALID_DATE_1, VALID_DATE_2).

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

module.exports = function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Método no permitido." });
  }

  const validDates = [process.env.VALID_DATE_1, process.env.VALID_DATE_2].filter(Boolean);
  if (validDates.length === 0) {
    return res.status(500).json({
      success: false,
      message: "El servidor no tiene fechas configuradas."
    });
  }

  const { date } = req.body || {};
  if (typeof date !== "string" || !DATE_RE.test(date)) {
    return res.status(400).json({ success: false, message: "Selecciona una fecha válida." });
  }

  if (validDates.includes(date)) {
    return res.json({ success: true, message: "El portal se ha desbloqueado." });
  }

  return res.json({
    success: false,
    message: "Todavía no… esa no parece ser la fecha."
  });
};
