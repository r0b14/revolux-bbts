export type Role = "admin" | "gestor" | "operador";
export function getUserRoleMock(email?: string | null): Role {
  if (!email) return "operador";
  if (email.includes("+admin")) return "admin";
  if (email.includes("+gestor")) return "gestor";
  return "operador";
}
