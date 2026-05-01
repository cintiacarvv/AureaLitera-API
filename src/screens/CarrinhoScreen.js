import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import { cartService } from '../services/cartService';

const COLORS = {
  primary: '#AE0000',
  background: '#FAF6EF',
  white: '#FFFFFF',
  text: '#555',
  lightGray: '#eee',
};

export default function CarrinhoScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const carregarItens = async () => {
        const itens = await cartService.listarItens();
        setCartItems(itens.map(item => ({
          ...item,
          quantity: item.quantity || 1
        })));
      };
      carregarItens();
    }, [])
  );

  const updateQuantity = (id, type) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const newQty = type === 'add' ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    Alert.alert("Remover Livro", "Deseja remover este item da sua sacola?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Remover", 
        style: "destructive", 
        onPress: async () => {
          await cartService.removerDoCarrinho(id);
          const novosItens = await cartService.listarItens();
          setCartItems(novosItens);
        } 
      }
    ]);
  };

  const total = cartItems.reduce((sum, item) => {
    const preco = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(',', '.')) 
      : item.price;
    return sum + (preco * item.quantity);
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minha Sacola</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <View key={item.id} style={styles.cartCard}>
              <Image 
                source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
                style={styles.bookImage} 
              />
              
              <View style={styles.infoContainer}>
                <View style={styles.titleRow}>
                  <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.bookAuthor}>{item.author}</Text>
                <Text style={styles.bookPrice}>
                   R$ {typeof item.price === 'string' ? item.price : item.price.toFixed(2).replace('.', ',')}
                </Text>

                <View style={styles.quantityContainer}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, 'sub')}>
                    <Ionicons name="remove" size={20} color={COLORS.text} />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, 'add')}>
                    <Ionicons name="add" size={20} color={COLORS.text} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="bag-handle-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Sua sacola está vazia</Text>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.navigate("Home")}
            >
                <Text style={styles.backButtonText}>Explorar Livros</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>R$ {total.toFixed(2).replace('.', ',')}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.checkoutBtn}
            onPress={() => navigation.navigate("Checkout", { total: total.toFixed(2) })}
          >
            <Text style={styles.checkoutBtnText}>Fechar Pedido</Text>
          </TouchableOpacity>
        </View>
      )}
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
  headerTitle: { color: COLORS.white, fontWeight: 'bold', fontSize: 18 },
  scrollContent: { padding: 20, paddingBottom: 150 },
  cartCard: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 15, padding: 15, marginBottom: 15, elevation: 3 },
  bookImage: { width: 70, height: 100, borderRadius: 8, backgroundColor: '#f9f9f9' },
  infoContainer: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, flex: 0.9 },
  bookAuthor: { fontSize: 13, color: '#888', marginTop: -5 },
  bookPrice: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.lightGray, borderRadius: 20, alignSelf: 'flex-start', marginTop: 10 },
  qtyBtn: { padding: 5, paddingHorizontal: 10 },
  qtyText: { fontWeight: 'bold', paddingHorizontal: 10, color: COLORS.text },
  footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: COLORS.white, padding: 20, borderTopLeftRadius: 25, borderTopRightRadius: 25, elevation: 20 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  totalValue: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
  checkoutBtn: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 25, alignItems: 'center' },
  checkoutBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontWeight: '600', color: '#999', marginTop: 10, marginBottom: 20 },
  backButton: { padding: 12, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 10 },
  backButtonText: { color: COLORS.primary, fontWeight: 'bold' }
});