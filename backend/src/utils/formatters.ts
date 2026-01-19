/**
 * Formatta la risposta utente per le API
 */
export interface UserWithRoles {
  id: number;
  email: string;
  nome: string;
  cognome: string;
  marca_id: number | null;
  ruoli: { nome: string };
  marche?: { nome: string } | null;
}

export function formatUserResponse(utente: UserWithRoles) {
  return {
    id: utente.id,
    email: utente.email,
    nome: utente.nome,
    cognome: utente.cognome,
    ruolo: utente.ruoli.nome,
    marca_id: utente.marca_id || undefined,
    marca_nome: utente.marche?.nome || undefined,
  };
}
