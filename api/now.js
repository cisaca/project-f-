// Función serverless de Vercel: GET /api/now
// Devuelve la fecha de hoy (AAAA-MM-DD) según el servidor, para los sobres con candado por fecha.
module.exports = function handler(_req, res) {
  res.setHeader("Cache-Control", "no-store");
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: process.env.TIMEZONE || "America/Santiago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
  res.json({ today });
};
