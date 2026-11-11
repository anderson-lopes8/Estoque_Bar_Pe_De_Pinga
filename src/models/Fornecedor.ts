export interface Fornecedor {
  id: number;
  nome: string;
  cnpj?: string;
  endereco?: string;
  telefone?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  email?: string;
}