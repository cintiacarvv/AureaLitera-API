import React from 'react';
import {
  StyleSheet, Text, View, ScrollView, Image,
  TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../context/CartContext';

const COLORS = {
  primary: '#AE0000',
  background: '#FAF6EF',
  white: '#FFFFFF',
  text: '#333',
  textMuted: '#888',
  lightGray: '#F0EDE8',
};

export default function CarrinhoScreen({ navigation, route }) {
  const user = route?.params?.user || {};
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();

  const handleRemove = (id, title) => {
    Alert.alert(
      'Remover livro',
      `Remover "${title}" do carrinho?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => removeFromCart(id) },
      ]
    );
  };

  const getImageSource = (item) => {
    if (!item.image) return null;
    if (typeof item.image === 'string') return { uri: item.image };
    if (item.cover_url) return { uri: item.cover_url };
    return item.image;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />

      {/* Header */}
      <LinearGradient colors={['#AE0000', '#8B0000']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Carrinho</Text>
        {cartItems.length > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartItems.length}</Text>
          </View>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </LinearGradient>

      {cartItems.length === 0 ? (
        /* ── Carrinho vazio ── */
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={90} color="#ddd" />
          <Text style={styles.emptyTitle}>Carrinho vazio</Text>
          <Text style={styles.emptySubtitle}>Explore a loja e adicione livros aqui</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.emptyBtnText}>Explorar livros</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

            {cartItems.map((item) => {
              const imageSource = getImageSource(item);
              const subtotal = (item.price * item.quantity).toFixed(2);

              return (
                <View key={String(item.id)} style={styles.card}>
                  {/* Capa */}
                  {imageSource ? (
                    <Image source={imageSource} style={styles.bookImage} resizeMode="cover" />
                  ) : (
                    <LinearGradient colors={['#AE0000', '#6B0000']} style={[styles.bookImage, styles.bookPlaceholder]}>
                      <Text style={styles.placeholderText}>
                        {item.title?.split(' ').slice(0, 2).map(w => w[0]).join('')}
                      </Text>
                    </LinearGradient>
                  )}

                  {/* Info */}
                  <View style={styles.infoContainer}>
                    <View style={styles.titleRow}>
                      <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
                      <TouchableOpacity
                        onPress={() => handleRemove(item.id, item.title)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons name="trash-outline" size={19} color={COLORS.primary} />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.bookAuthor}>{item.author}</Text>
                    <Text style={styles.bookPrice}>R$ {Number(item.price).toFixed(2)}</Text>

                    {/* Controle de quantidade */}
                    <View style={styles.qtyRow}>
                      <View style={styles.qtyControl}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => updateQuantity(item.id, 'sub')}
                        >
                          <Ionicons name="remove" size={16} color={COLORS.text} />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => updateQuantity(item.id, 'add')}
                        >
                          <Ionicons name="add" size={16} color={COLORS.text} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.subtotal}>R$ {subtotal}</Text>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Resumo */}
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'})</Text>
                <Text style={styles.summaryValue}>R$ {totalPrice.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Entrega</Text>
                <Text style={[styles.summaryValue, { color: '#2E7D32' }]}>Grátis</Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>R$ {totalPrice.toFixed(2)}</Text>
              </View>
            </View>

            <View style={{ height: 110 }} />
          </ScrollView>

          {/* Footer fixo */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.checkoutBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Checkout', { total: totalPrice.toFixed(2), user })}
            >
              <Text style={styles.checkoutBtnText}>Finalizar Compra</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
  },
  headerTitle: { color: COLORS.white, fontFamily: 'PoppinsBold', fontSize: 18 },
  badge: {
    backgroundColor: '#fff', width: 24, height: 24,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: COLORS.primary, fontFamily: 'PoppinsBold', fontSize: 12 },

  // Vazio
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
  emptyTitle: { fontFamily: 'PoppinsBold', fontSize: 20, color: '#aaa', marginTop: 16 },
  emptySubtitle: { fontFamily: 'PoppinsSemiBold', fontSize: 14, color: '#ccc', marginTop: 6, marginBottom: 28 },
  emptyBtn: {
    borderWidth: 1.5, borderColor: COLORS.primary,
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: 28,
  },
  emptyBtnText: { color: COLORS.primary, fontFamily: 'PoppinsBold', fontSize: 14 },

  scrollContent: { padding: 16 },

  // Card
  card: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    borderRadius: 16, padding: 14, marginBottom: 12,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 5,
  },
  bookImage: { width: 68, height: 100, borderRadius: 9 },
  bookPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: 'rgba(255,255,255,0.7)', fontFamily: 'PoppinsBold', fontSize: 18 },

  infoContainer: { flex: 1, marginLeft: 14 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 },
  bookTitle: { flex: 1, fontFamily: 'PoppinsBold', fontSize: 14, color: COLORS.text, marginRight: 8 },
  bookAuthor: { fontFamily: 'PoppinsSemiBold', fontSize: 12, color: COLORS.textMuted, marginBottom: 4 },
  bookPrice: { fontFamily: 'PoppinsSemiBold', fontSize: 13, color: COLORS.textMuted },

  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  qtyControl: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.lightGray, borderRadius: 20,
  },
  qtyBtn: { padding: 6, paddingHorizontal: 10 },
  qtyText: { fontFamily: 'PoppinsBold', fontSize: 14, color: COLORS.text, minWidth: 20, textAlign: 'center' },
  subtotal: { fontFamily: 'PoppinsBold', fontSize: 14, color: COLORS.primary },

  // Resumo
  summaryBox: {
    backgroundColor: COLORS.white, borderRadius: 16,
    padding: 18, marginTop: 4,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontFamily: 'PoppinsSemiBold', fontSize: 14, color: COLORS.textMuted },
  summaryValue: { fontFamily: 'PoppinsSemiBold', fontSize: 14, color: COLORS.text },
  summaryTotal: {
    borderTopWidth: 1, borderTopColor: '#eee',
    paddingTop: 12, marginBottom: 0,
  },
  totalLabel: { fontFamily: 'PoppinsBold', fontSize: 16, color: COLORS.text },
  totalValue: { fontFamily: 'PoppinsBold', fontSize: 20, color: COLORS.primary },

  // Footer
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.white, padding: 16, paddingBottom: 24,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    elevation: 16, shadowColor: '#000', shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: -3 }, shadowRadius: 8,
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14,
    paddingVertical: 15, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  checkoutBtnText: { color: COLORS.white, fontFamily: 'PoppinsBold', fontSize: 16 },
});