// Diagnóstico: muestra SI las variables existen (true/false) y el entorno. Nunca muestra los valores.
module.exports = function handler(_req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.json({
    ok: true,
    service: "portal-especial",
    vercelEnv: process.env.VERCEL_ENV || "local",
    configured: {
      VALID_DATE_1: Boolean(process.env.VALID_DATE_1),
      VALID_DATE_2: Boolean(process.env.VALID_DATE_2)
    }
  });
};
