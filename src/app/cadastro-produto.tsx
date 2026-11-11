import React, { useState, useEffect } from 'react';
import { Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db } from '../database/database';
import { Colors } from '../constants/colors';

export default function CadastroProdutoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('5');
  const [fornecedorId, setFornecedorId] = useState('');

  useEffect(() => {
    if (id) {
      const prod = db.getFirstSync<any>('SELECT * FROM produtos WHERE id = ?;', [Number(id)]);
      if (prod) {
        setNome(prod.nome);
        setCategoria(prod.categoria);
        setPreco(prod.preco.toString());
        setQuantidade(prod.quantidade.toString());
        setEstoqueMinimo(prod.estoque_minimo.toString());
        setFornecedorId(prod.fornecedor_id ? prod.fornecedor_id.toString() : '');
      }
    }
  }, [id]);

  // ADICIONADO O ASYNC AQUI:
  const salvar = async () => {
    if (!nome || !categoria || !preco) {
      Alert.alert('Atenção', 'Preencha os campos obrigatórios (Nome, Categoria e Preço).');
      return;
    }

    const pPreco = parseFloat(preco);
    const pQtd = parseInt(quantidade || '0', 10);
    const pMin = parseInt(estoqueMinimo || '5', 10);
    const pForn = fornecedorId ? parseInt(fornecedorId, 10) : null;

    try {
      if (id) {
        await db.runAsync(
          `UPDATE produtos SET nome=?, categoria=?, preco=?, quantidade=?, estoque_minimo=?, fornecedor_id=? WHERE id=?;`,
          [nome, categoria, pPreco, pQtd, pMin, pForn, Number(id)]
        );
        Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      } else {
        await db.runAsync(
          `INSERT INTO produtos (nome, categoria, preco, quantidade, estoque_minimo, fornecedor_id) VALUES (?, ?, ?, ?, ?, ?);`,
          [nome, categoria, pPreco, pQtd, pMin, pForn]
        );
        Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
      }
      
      router.back();

    } catch (error) {
      console.error("Erro ao salvar o produto:", error);
      Alert.alert('Erro', 'Não foi possível salvar o produto.');
    }
  }; 

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome do Produto *</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Cerveja Pilsen 600ml" />

      <Text style={styles.label}>Categoria *</Text>
      <TextInput style={styles.input} value={categoria} onChangeText={setCategoria} placeholder="Ex: Cervejas" />

      <Text style={styles.label}>Preço (R$) *</Text>
      <TextInput style={styles.input} value={preco} onChangeText={setPreco} keyboardType="numeric" placeholder="0.00" />

      <Text style={styles.label}>Quantidade Inicial</Text>
      <TextInput style={styles.input} value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" placeholder="0" />

      <Text style={styles.label}>Estoque Mínimo (Alerta)</Text>
      <TextInput style={styles.input} value={estoqueMinimo} onChangeText={setEstoqueMinimo} keyboardType="numeric" />

      <Text style={styles.label}>ID do Fornecedor (Opcional)</Text>
      <TextInput style={styles.input} value={fornecedorId} onChangeText={setFornecedorId} keyboardType="numeric" placeholder="Código do fornecedor" />

      <TouchableOpacity style={styles.saveBtn} onPress={salvar}>
        <Text style={styles.saveText}>{id ? 'Atualizar Produto' : 'Cadastrar Produto'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: Colors.background },
  label: { fontSize: 13, color: Colors.primary, fontWeight: 'bold', marginTop: 10, marginBottom: 4 },
  input: { backgroundColor: Colors.surface, padding: 12, borderRadius: 6, borderWidth: 1, borderColor: Colors.border, color: Colors.text },
  saveBtn: { backgroundColor: Colors.success, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  saveText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
});
