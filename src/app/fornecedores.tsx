import React, { useState, useCallback } from 'react';
import { Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { db } from '../database/database';
import { Fornecedor } from '../models/Fornecedor';
import { Colors } from '../constants/colors';

export default function FornecedoresScreen() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [email, setEmail] = useState('');

  const carregarFornecedores = () => {
    const res = db.getAllSync<Fornecedor>('SELECT * FROM fornecedores;');
    setFornecedores(res);
  };

  useFocusEffect(
    useCallback(() => {
      carregarFornecedores();
    }, [])
  );

  const cadastrar = () => {
    if (!nome) {
      Alert.alert('Atenção', 'O nome do fornecedor é obrigatório.');
      return;
    }

    db.runSync(
      `INSERT INTO fornecedores (nome, cnpj, endereco, telefone, bairro, cidade, estado, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [nome, cnpj, endereco, telefone, bairro, cidade, estado, email]
    );

    Alert.alert('Sucesso', 'Fornecedor cadastrado!');
    setNome('');
    setCnpj('');
    setEndereco('');
    setTelefone('');
    setBairro('');
    setCidade('');
    setEstado('');
    setEmail('');
    carregarFornecedores();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Cadastrar Novo Fornecedor</Text>

      <TextInput style={styles.input} placeholder="Nome *" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="CNPJ" value={cnpj} onChangeText={setCnpj} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Endereço" value={endereco} onChangeText={setEndereco} />
      <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Bairro" value={bairro} onChangeText={setBairro} />
      <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} />
      <TextInput style={styles.input} placeholder="Estado (UF)" value={estado} onChangeText={setEstado} maxLength={2} />
      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />

      <TouchableOpacity style={styles.saveBtn} onPress={cadastrar}>
        <Text style={styles.saveText}>Salvar Fornecedor</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Fornecedores Cadastrados</Text>

      {fornecedores.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.cardTitle}>#{item.id} - {item.nome}</Text>
          {item.cnpj ? <Text style={styles.cardText}>CNPJ: {item.cnpj}</Text> : null}
          {item.telefone ? <Text style={styles.cardText}>Telefone: {item.telefone}</Text> : null}
          {item.email ? <Text style={styles.cardText}>E-mail: {item.email}</Text> : null}
          {item.cidade ? <Text style={styles.cardText}>Local: {item.cidade} - {item.estado}</Text> : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: Colors.background },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, marginTop: 16, marginBottom: 8 },
  input: { backgroundColor: Colors.surface, padding: 10, borderRadius: 6, borderWidth: 1, borderColor: Colors.border, marginBottom: 8, color: Colors.text },
  saveBtn: { backgroundColor: Colors.primary, padding: 14, borderRadius: 6, alignItems: 'center', marginVertical: 10 },
  saveText: { color: '#FFF', fontWeight: 'bold' },
  card: { backgroundColor: Colors.surface, padding: 12, borderRadius: 6, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  cardTitle: { fontWeight: 'bold', fontSize: 15, color: Colors.text },
  cardText: { fontSize: 13, color: Colors.textLight },
});