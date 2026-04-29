import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Importação das imagens (certifique-se que os caminhos estão corretos)
import book1 from '../../assets/book1.jpg';
import book2 from '../../assets/book2.jpg';
import book3 from '../../assets/book3.jpg';

const COLORS = {
  primary: '#AE0000',
  background: '#FAF6EF',
  white: '#FFFFFF',
  text: '#555',
  lightGray: '#eee',
};

export default function CarrinhoScreen({ navigation }) {
  // Itens iniciais do carrinho
  const [cartItems, setCartItems] = useState([
    { id: 1, title: 'The Shining', author: 'Stephen King', price: 45.90, image: book1, quantity: 1 },
    { id: 2, title: 'A Sutil Arte...', author: 'Mark Manson', price: 39.90, image: book2, quantity: 1 },
    { id: 3, title: 'A Bailarina de...', author: 'Edith Eva Eger', price: 54.00, image: book3, quantity: 1 },
  ]);

  // Função para aumentar ou diminuir quantidade
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

  // Função para remover item com confirmação
  const removeItem = (id) => {
    Alert.alert("Remover Livro", "Tem certeza que deseja tirar este livro do carrinho?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Remover", 
        style: "destructive", 
        onPress: () => setCartItems(prevItems => prevItems.filter(item => item.id !== id)) 
      }
    ]);
  };

  // Cálculo do valor total
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Carrinho</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <View key={item.id} style={styles.cartCard}>
              <Image source={item.image} style={styles.bookImage} />
              
              <View style={styles.infoContainer}>
                <View style={styles.titleRow}>
                  <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.bookAuthor}>{item.author}</Text>
                <Text style={styles.bookPrice}>R$ {item.price.toFixed(2)}</Text>

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
            <Ionicons name="cart-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.navigate("Home")}
            >
                <Text style={styles.backButtonText}>Voltar para a Loja</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Footer Fixo */}
      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.checkoutBtn}
            onPress={() => navigation.navigate("Checkout", { total: total.toFixed(2) })}
          >
            <Text style={styles.checkoutBtnText}>Finalizar Compra</Text>
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
  headerTitle: {
    color: COLORS.white,
    fontFamily: 'PoppinsBold',
    fontSize: 18,
  },
  scrollContent: { padding: 20, paddingBottom: 120 },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookImage: { width: 70, height: 100, borderRadius: 8 },
  infoContainer: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookTitle: { fontSize: 16, fontFamily: 'PoppinsBold', color: COLORS.text, flex: 0.9 },
  bookAuthor: { fontSize: 13, color: '#888', marginTop: -5 },
  bookPrice: { fontSize: 16, fontFamily: 'PoppinsBold', color: COLORS.primary },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  qtyBtn: { padding: 5, paddingHorizontal: 10 },
  qtyText: { fontFamily: 'PoppinsBold', paddingHorizontal: 10, color: COLORS.text },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontSize: 18, fontFamily: 'PoppinsSemiBold', color: COLORS.text },
  totalValue: { fontSize: 22, fontFamily: 'PoppinsBold', color: COLORS.primary },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  checkoutBtnText: { color: COLORS.white, fontFamily: 'PoppinsBold', fontSize: 16 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontFamily: 'PoppinsSemiBold', color: '#999', marginTop: 10, marginBottom: 20 },
  backButton: {
      padding: 10,
      borderWidth: 1,
      borderColor: COLORS.primary,
      borderRadius: 10
  },
  backButtonText: { color: COLORS.primary, fontFamily: 'PoppinsBold' }
});