/**
 * Token atual para chamadas autenticadas a /api/medicines.
 * Ligado ao {@code AuthProvider} para manter o valor em sync com a sessão.
 */
let resolveAccessToken: () => string | null = () => null;

export function setMedicineApiAccessTokenGetter(
  getter: () => string | null
): void {
  resolveAccessToken = getter;
}

export function getMedicineApiAccessToken(): string | null {
  return resolveAccessToken();
}
