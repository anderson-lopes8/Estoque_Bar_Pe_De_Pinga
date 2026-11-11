export interface Movimentacao {
  id: number;
  produto_id: number;
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: number;
  observacao?: string;
  data: string;
}