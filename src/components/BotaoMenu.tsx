import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface BotaoMenuProps {
  titulo: string;
  onPress: () => void;
  cor?: string;
}

export const BotaoMenu = ({ titulo, onPress, cor = Colors.primary }: BotaoMenuProps) => (
  <TouchableOpacity style={[styles.button, { backgroundColor: cor }]} onPress={onPress}>
    <Text style={styles.text}>{titulo}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: { padding: 16, borderRadius: 8, alignItems: 'center', marginVertical: 6, width: '100%' },
  text: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});