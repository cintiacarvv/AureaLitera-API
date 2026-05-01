import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#AE0000',
  background: '#FAF6EF',
  white: '#FFFFFF',
  text: '#555',
  border: '#DDD',
};

export default function CartaoDadosScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [numero, setNumero] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dados do Cartão</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Nome no Cartão</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: JOÃO A SILVA" 
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Número do Cartão</Text>
        <TextInput 
          style={styles.input} 
          placeholder="0000 0000 0000 0000" 
          keyboardType="numeric"
          value={numero}
          onChangeText={setNumero}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Validade</Text>
            <TextInput 
              style={styles.input} 
              placeholder="MM/AA" 
              keyboardType="numeric"
              value={validade}
              onChangeText={setValidade}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.label}>CVV</Text>
            <TextInput 
              style={styles.input} 
              placeholder="123" 
              keyboardType="numeric"
              secureTextEntry
              value={cvv}
              onChangeText={setCvv}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => navigation.navigate("Sucesso")}
        >
          <Text style={styles.confirmButtonText}>Finalizar Pagamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    backgroundColor: COLORS.primary, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    paddingTop: 50 
  },
  headerTitle: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  label: { fontSize: 14, color: COLORS.text, marginBottom: 5, marginTop: 15, fontWeight: '600' },
  input: { 
    backgroundColor: COLORS.white, 
    borderWidth: 1, 
    borderColor: COLORS.border, 
    borderRadius: 10, 
    padding: 12, 
    fontSize: 16 
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  confirmButton: { 
    backgroundColor: COLORS.primary, 
    padding: 18, 
    borderRadius: 25, 
    alignItems: 'center', 
    marginTop: 40 
  },
  confirmButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
});