import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BotaoMenu } from '../components/BotaoMenu';
import { Colors } from '../constants/colors';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../../assets/images/logo-bar.jpg')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Estoque - Bar Pé de Pinga</Text>
      <Text style={styles.subtitle}>Controle inteligente de bebidas e mercadorias</Text>

      <View style={styles.menuContainer}>
        <BotaoMenu titulo="📦 Consultar Produtos" onPress={() => router.push('/produtos')} />
        <BotaoMenu titulo="➕ Cadastrar / Editar Produto" onPress={() => router.push('/cadastro-produto')} />
        <BotaoMenu titulo="🔄 Registrar Movimentação" onPress={() => router.push('/movimentacoes')} cor={Colors.success} />
        <BotaoMenu titulo="🏢 Gerenciar Fornecedores" onPress={() => router.push('/fornecedores')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', backgroundColor: Colors.background, flexGrow: 1 },
  logo: { width: 120, height: 120, marginBottom: 10 },
  title: { fontSize: 26, fontWeight: 'bold', color: Colors.primary, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.textLight, textAlign: 'center', marginBottom: 24 },
  menuContainer: { width: '100%', gap: 4 },
});