export interface Produto {
  id?: number;
  nome: string;
  categoria: string;
  preco: number;
  quantidade: number;
  estoque_minimo: number;
  fornecedor_id?: number;
}