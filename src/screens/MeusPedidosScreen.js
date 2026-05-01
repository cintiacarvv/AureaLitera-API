import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#AE0000',
  background: '#FAF6EF',
  white: '#FFFFFF',
  text: '#555',
  accent: '#4CAF50',
  gray: '#888',
};

const PEDIDOS_MOCK = [
  {
    id: '1',
    status: 'Em Transporte',
    data: '25/04/2026',
    total: 'R$ 87,90',
    livros: ['O Iluminado', 'It: A Coisa'],
    rastreio: 'BR123456789',
  },
  {
    id: '2',
    status: 'Entregue',
    data: '10/03/2026',
    total: 'R$ 45,00',
    livros: ['A Bailarina de Auschwitz'],
    rastreio: 'BR987654321',
  }
];

export default function MeusPedidosScreen({ navigation }) {
  const renderPedido = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.pedidoId}>Pedido #{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.status === 'Entregue' ? '#E8F5E9' : '#FFF3E0' }]}>
          <Text style={[styles.statusText, { color: item.status === 'Entregue' ? '#2E7D32' : '#EF6C00' }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Data: <Text style={styles.value}>{item.data}</Text></Text>
        <Text style={styles.label}>Itens: <Text style={styles.value}>{item.livros.join(', ')}</Text></Text>
        <Text style={styles.label}>Total: <Text style={styles.totalValue}>{item.total}</Text></Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.rastreioBox}>
          <Ionicons name="cube-outline" size={16} color={COLORS.gray} />
          <Text style={styles.rastreioText}>Rastreio: {item.rastreio}</Text>
        </View>
        <TouchableOpacity style={styles.detalhesBtn}>
          <Text style={styles.detalhesBtnText}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={PEDIDOS_MOCK}
        keyExtractor={item => item.id}
        renderItem={renderPedido}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={<Text style={styles.empty}>Você ainda não possui pedidos físicos.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { fontFamily: 'PoppinsBold', fontSize: 18, color: COLORS.text },
  card: { backgroundColor: COLORS.white, borderRadius: 15, padding: 15, marginBottom: 20, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  pedidoId: { fontFamily: 'PoppinsBold', fontSize: 16, color: COLORS.text },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 12, fontFamily: 'PoppinsBold' },
  content: { marginVertical: 15 },
  label: { fontFamily: 'PoppinsSemiBold', color: '#888', fontSize: 13, marginBottom: 3 },
  value: { color: COLORS.text },
  totalValue: { color: COLORS.primary, fontFamily: 'PoppinsBold' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  rastreioBox: { flexDirection: 'row', alignItems: 'center' },
  rastreioText: { marginLeft: 5, fontSize: 12, color: '#888', fontFamily: 'PoppinsSemiBold' },
  detalhesBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  detalhesBtnText: { color: '#fff', fontSize: 12, fontFamily: 'PoppinsBold' },
  empty: { textAlign: 'center', marginTop: 50, color: '#999', fontFamily: 'PoppinsSemiBold' }
});