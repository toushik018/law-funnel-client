export interface RvgTableRow { upperBound: number; fee10: number; }
export interface ComputeRvgOptions { withAuslagenPauschale?: boolean; withVAT?: boolean; isKleinunternehmer?: boolean; incrementPer50k?: number; }
export interface ComputeRvgResult { fee1_0: number; fee: number; auslagen: number; subtotal: number; vat: number; total: number; extraUnits: number; }

function round2(n: number): number { return Math.round((n + Number.EPSILON) * 100) / 100; }

export function computeRvgFee(
  gegenstandswert: number,
  gebuehrensatz: number,
  table: RvgTableRow[],
  opts: ComputeRvgOptions = {}
): ComputeRvgResult {
  const { withAuslagenPauschale = true, withVAT = true, isKleinunternehmer = false, incrementPer50k = 175 } = opts;
  if (gegenstandswert <= 0 || gebuehrensatz <= 0) throw new Error('Invalid inputs');
  const sorted = [...table].sort((a, b) => a.upperBound - b.upperBound);
  const maxRow = sorted[sorted.length - 1];
  let fee1_0: number; let extraUnits = 0;
  const found = sorted.find((r) => gegenstandswert <= r.upperBound);
  if (found) fee1_0 = found.fee10; else { extraUnits = Math.ceil((gegenstandswert - maxRow.upperBound) / 50000); fee1_0 = maxRow.fee10 + extraUnits * incrementPer50k; }
  const fee = round2(fee1_0 * gebuehrensatz);
  const auslagen = withAuslagenPauschale ? Math.min(round2(0.2 * fee), 20) : 0;
  const subtotal = round2(fee + auslagen);
  const vat = withVAT && !isKleinunternehmer ? round2(subtotal * 0.19) : 0;
  const total = round2(subtotal + vat);
  return { fee1_0, fee, auslagen, subtotal, vat, total, extraUnits };
}
