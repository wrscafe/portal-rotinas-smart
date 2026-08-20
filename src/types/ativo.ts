// Representa um ativo (caminhão, motor estacionário, etc.) cadastrado no sistema
export interface Ativo {
  id: string;
  categoria: string;
  codigo_interno: string;
  fabricante: string | null;
  modelo: string | null;
  criado_em: string;
}
