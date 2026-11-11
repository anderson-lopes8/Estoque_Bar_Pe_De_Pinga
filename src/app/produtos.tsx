import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/colors';
import { db } from '../database/database';
import { Produto } from '../models/Produto';

export default function ProdutosScreen() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState('');
  const router = useRouter();

  const carregarProdutos = () => {
    const res = db.getAllSync<Produto>('SELECT * FROM produtos WHERE nome LIKE ?;', [`%${busca}%`]);
    setProdutos(res);
  };

  useFocusEffect(
    useCallback(() => {
      carregarProdutos();
    }, [busca])
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputSearch}
        placeholder="Pesquisar produto por nome..."
        placeholderTextColor={Colors.textLight}
        value={busca}
        onChangeText={setBusca}
      />

      <FlatList
        data={produtos}
        keyExtractor={(item) => String(item.id ?? 0)}
        renderItem={({ item }) => {
          const produtoId = item.id ?? 0;
          const alerta = item.quantidade <= item.estoque_minimo;

          if (!produtoId) {
            return null;
          }

          return (
            <View style={[styles.card, alerta && styles.cardAlerta]}>
              <View style={styles.cardHeader}>
                <Text style={styles.codigo}>Cód: #{produtoId}</Text>
                <Text style={styles.nome}>{item.nome}</Text>
              </View>
              <Text style={styles.detalhe}>Categoria: {item.categoria}</Text>
              <Text style={styles.detalhe}>Preço: R$ {item.preco.toFixed(2)}</Text>
              <Text style={[styles.detalhe, alerta ? { color: Colors.danger, fontWeight: 'bold' } : { color: Colors.success }]}>
                Quantidade: {item.quantidade} (Mínimo: {item.estoque_minimo})
              </Text>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => router.push({ pathname: '/cadastro-produto', params: { id: String(produtoId) } })}
              >
                <Text style={styles.editBtnText}>Editar Produto</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum produto encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.background },
  inputSearch: { backgroundColor: Colors.surface, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, marginBottom: 14, color: Colors.text },
  card: { backgroundColor: Colors.surface, padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  cardAlerta: { borderColor: Colors.danger, borderWidth: 1.5, backgroundColor: '#FFF5F5' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  codigo: { fontSize: 12, fontWeight: 'bold', color: Colors.primary },
  nome: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  detalhe: { fontSize: 13, color: Colors.textLight, marginTop: 2 },
  editBtn: { marginTop: 8, backgroundColor: Colors.primary, padding: 8, borderRadius: 6, alignItems: 'center' },
  editBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  empty: { textAlign: 'center', color: Colors.textLight, marginTop: 20 },
});