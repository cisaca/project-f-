import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3001);
const validDates = [process.env.VALID_DATE_1, process.env.VALID_DATE_2].filter(Boolean);

if (validDates.length === 0) {
  console.warn("⚠ Falta server/.env con VALID_DATE_1 / VALID_DATE_2 (copia server/.env.example).");
}

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "portal-especial" });
});

app.post("/api/unlock", (req, res) => {
  const { date } = req.body || {};

  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      success: false,
      message: "Selecciona una fecha válida."
    });
  }

  if (validDates.includes(date)) {
    return res.json({
      success: true,
      message: "El portal se ha desbloqueado."
    });
  }

  return res.json({
    success: false,
    message: "Todavía no… esa no parece ser la fecha."
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.resolve(__dirname, "../client/dist");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Portal Especial API: http://localhost:${PORT}`);
});
