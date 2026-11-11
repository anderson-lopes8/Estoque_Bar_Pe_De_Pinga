import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { db } from '../database/database';
import { Colors } from '../constants/colors';

export default function MovimentacoesScreen() {
  const [codigo, setCodigo] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [observacao, setObservacao] = useState('');
  const [produto, setProduto] = useState<any>(null);

  const buscarProduto = () => {
    if (!codigo) return;
    const prod = db.getFirstSync<any>('SELECT * FROM produtos WHERE id = ?;', [Number(codigo)]);
    if (prod) {
      setProduto(prod);
    } else {
      setProduto(null);
      Alert.alert('Erro', 'Nenhum produto encontrado com este código.');
    }
  };

  const registrar = (tipo: 'ENTRADA' | 'SAIDA') => {
    if (!codigo || !quantidade) {
      Alert.alert('Atenção', 'Informe o código do produto e a quantidade.');
      return;
    }

    const qtd = parseInt(quantidade, 10);
    if (isNaN(qtd) || qtd <= 0) {
      Alert.alert('Erro', 'Quantidade inválida.');
      return;
    }

    const prod = db.getFirstSync<any>('SELECT * FROM produtos WHERE id = ?;', [Number(codigo)]);
    if (!prod) {
      Alert.alert('Erro', 'Produto não localizado.');
      return;
    }

    if (tipo === 'SAIDA' && prod.quantidade < qtd) {
      Alert.alert('Atenção', 'Estoque insuficiente para realizar esta saída.');
      return;
    }

    const novaQtd = tipo === 'ENTRADA' ? prod.quantidade + qtd : prod.quantidade - qtd;

    db.runSync(
      `INSERT INTO movimentacoes (produto_id, tipo, quantidade, observacao) VALUES (?, ?, ?, ?);`,
      [prod.id, tipo, qtd, observacao]
    );

    db.runSync(`UPDATE produtos SET quantidade = ? WHERE id = ?;`, [novaQtd, prod.id]);

    Alert.alert('Sucesso', `Movimentação de ${tipo} registrada!`);
    setCodigo('');
    setQuantidade('');
    setObservacao('');
    setProduto(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Código do Produto (ID)</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={codigo}
          onChangeText={setCodigo}
          keyboardType="numeric"
          placeholder="Ex: 1"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={buscarProduto}>
          <Text style={styles.searchBtnText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {produto && (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>{produto.nome}</Text>
          <Text style={styles.text}>Categoria: {produto.categoria}</Text>
          <Text style={[styles.text, { fontWeight: 'bold', marginTop: 4 }]}>Estoque Atual: {produto.quantidade}</Text>
        </View>
      )}

      <Text style={styles.label}>Quantidade</Text>
      <TextInput
        style={styles.input}
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
        placeholder="0"
      />

      <Text style={styles.label}>Observação</Text>
      <TextInput
        style={styles.input}
        value={observacao}
        onChangeText={setObservacao}
        placeholder="Ex: Compra de lote / Consumo"
      />

      <View style={styles.btnRow}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.success }]} onPress={() => registrar('ENTRADA')}>
          <Text style={styles.btnText}>+ Registrar Entrada</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: Colors.danger }]} onPress={() => registrar('SAIDA')}>
          <Text style={styles.btnText}>- Registrar Saída</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: Colors.background },
  label: { fontSize: 13, color: Colors.primary, fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  input: { backgroundColor: Colors.surface, padding: 12, borderRadius: 6, borderWidth: 1, borderColor: Colors.border, color: Colors.text },
  row: { flexDirection: 'row', gap: 8 },
  searchBtn: { backgroundColor: Colors.primary, paddingHorizontal: 16, justifyContent: 'center', borderRadius: 6 },
  searchBtnText: { color: '#FFF', fontWeight: 'bold' },
  infoBox: { backgroundColor: '#E3F2FD', padding: 12, borderRadius: 6, marginTop: 12, borderWidth: 1, borderColor: '#90CAF9' },
  infoTitle: { fontWeight: 'bold', fontSize: 15, color: Colors.primary },
  text: { color: Colors.text, fontSize: 13 },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 24 },
  actionBtn: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
});