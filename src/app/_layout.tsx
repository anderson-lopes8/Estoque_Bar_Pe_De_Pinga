import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Colors } from '../constants/colors';
import { initDatabase } from '../database/database';

export default function Layout() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Estoque - Pé de Pinga' }} />
      <Stack.Screen name="produtos" options={{ title: 'Catálogo de Produtos' }} />
      <Stack.Screen name="cadastro-produto" options={{ title: 'Cadastro e Edição' }} />
      <Stack.Screen name="movimentacoes" options={{ title: 'Entrada e Saída' }} />
      <Stack.Screen name="fornecedores" options={{ title: 'Gestão de Fornecedores' }} />
    </Stack>
  );
}
