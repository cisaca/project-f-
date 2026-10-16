// Progreso de las cartitas (se guarda en el navegador).
// La puerta final se abre solo cuando están completas las 4 anteriores.

const KEY = "portal-progreso:v1";

export const STEPS = ["agreement", "memories", "letters", "oracle"];

export function getProgress() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

export function setFlag(name) {
  try {
    const cur = getProgress();
    if (cur[name]) return false;
    localStorage.setItem(KEY, JSON.stringify({ ...cur, [name]: true }));
    return true;
  } catch {
    return false;
  }
}

export const markDone = setFlag;
export const doneCount = (p = getProgress()) => STEPS.filter((s) => p[s]).length;
export const allDone = (p = getProgress()) => doneCount(p) === STEPS.length;
