import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const COLORS = {
  primary: '#AE0000',
  background: '#FAF6EF',
  white: '#FFFFFF',
  text: '#555',
  lightGray: '#eee',
};

export default function PagamentoScreen({ navigation, route }) {
  const [metodo, setMetodo] = useState('pix');
  const total = route.params?.total || "0,00";

  const handlePagamento = () => {
    if (metodo === 'cartao') {
      navigation.navigate("CartaoDados");
    } else {
      Alert.alert("Pix Selecionado", "O QR Code será gerado na próxima etapa.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pagamento</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.resumoContainer}>
          <Text style={styles.resumoLabel}>Valor a pagar:</Text>
          <Text style={styles.resumoValor}>R$ {total}</Text>
        </View>

        <Text style={styles.sectionTitle}>Escolha como pagar</Text>

        <TouchableOpacity 
          style={[styles.optionCard, metodo === 'pix' && styles.selectedCard]} 
          onPress={() => setMetodo('pix')}
        >
          <View style={styles.optionInfo}>
            <Ionicons name="qr-code-outline" size={24} color={metodo === 'pix' ? COLORS.primary : COLORS.text} />
            <Text style={[styles.optionText, metodo === 'pix' && styles.selectedText]}>Pix</Text>
          </View>
          <Ionicons 
            name={metodo === 'pix' ? "radio-button-on" : "radio-button-off"} 
            size={22} 
            color={metodo === 'pix' ? COLORS.primary : '#ccc'} 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.optionCard, metodo === 'cartao' && styles.selectedCard]} 
          onPress={() => setMetodo('cartao')}
        >
          <View style={styles.optionInfo}>
            <Ionicons name="card-outline" size={24} color={metodo === 'cartao' ? COLORS.primary : COLORS.text} />
            <Text style={[styles.optionText, metodo === 'cartao' && styles.selectedText]}>Cartão de Crédito</Text>
          </View>
          <Ionicons 
            name={metodo === 'cartao' ? "radio-button-on" : "radio-button-off"} 
            size={22} 
            color={metodo === 'cartao' ? COLORS.primary : '#ccc'} 
          />
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#4CAF50" />
          <Text style={styles.infoBoxText}>Pagamento 100% seguro e criptografado.</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.payButton}
          onPress={handlePagamento}
        >
          <Text style={styles.payButtonText}>
            {metodo === 'pix' ? 'Gerar Código Pix' : 'Próximo: Dados do Cartão'}
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 50,
  },
  headerTitle: { color: COLORS.white, fontFamily: 'PoppinsBold', fontSize: 18 },
  content: { padding: 20 },
  resumoContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 2,
  },
  resumoLabel: { fontFamily: 'PoppinsSemiBold', color: '#888', fontSize: 14 },
  resumoValor: { fontFamily: 'PoppinsBold', color: COLORS.primary, fontSize: 28 },
  sectionTitle: { fontFamily: 'PoppinsBold', fontSize: 16, color: COLORS.text, marginBottom: 15 },
  optionCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: { borderColor: COLORS.primary },
  optionInfo: { flexDirection: 'row', alignItems: 'center' },
  optionText: { marginLeft: 15, fontFamily: 'PoppinsSemiBold', fontSize: 16, color: COLORS.text },
  selectedText: { color: COLORS.primary },
  infoBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  infoBoxText: { marginLeft: 8, fontSize: 12, color: '#888', fontFamily: 'PoppinsSemiBold' },
  footer: { padding: 20, backgroundColor: COLORS.white, borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  payButton: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 25, alignItems: 'center' },
  payButtonText: { color: COLORS.white, fontFamily: 'PoppinsBold', fontSize: 16 },
});