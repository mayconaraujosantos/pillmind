const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function normalizeTimeToken(token: string): string | null {
  const m = token.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (hh > 23 || mm > 59) return null;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

/** Aceita vírgula, ponto e vírgula ou espaço entre horários. */
export function parseDoseTimesField(input: string): string[] {
  const parts = input.split(/[,;]+|\s+/).map((s) => s.trim()).filter(Boolean);
  const out: string[] = [];
  for (const p of parts) {
    const n = normalizeTimeToken(p);
    if (n) out.push(n);
  }
  return out;
}

export function parseISODateOnly(value: string): Date | null {
  const v = value.trim();
  if (!ISO_DATE.test(v)) return null;
  const d = new Date(`${v}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDateInput(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
