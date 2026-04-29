import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import book1 from '../../assets/book1.jpg';
import book2 from '../../assets/book2.jpg';
import book3 from '../../assets/book3.jpg';
import book4 from '../../assets/book4.jpg';
import book5 from '../../assets/book5.jpg';
import book6 from '../../assets/book6.jpg';
import book7 from '../../assets/book7.jpg';

const screenWidth = Dimensions.get('window').width;

export default function CategoriaScreen({ route, navigation }) {
  const { tipo } = route.params;

  const todosProdutos = [
    { id: '1', title: 'The Shining', author: 'Stephen King', price: 'R$ 45,90', category: 'Terror', image: book1 },
    { id: '2', title: 'It: A Coisa', author: 'Stephen King', price: 'R$ 102,90', category: 'Terror', image: book7 },
    { id: '3', title: 'A Sutil Arte', author: 'Mark Manson', price: 'R$ 34,90', category: 'Autoajuda', image: book2 },
    { id: '4', title: 'Bailarina Auschwitz', author: 'Edith Eger', price: 'R$ 42,00', category: 'Autoajuda', image: book3 },
    { id: '5', title: 'Ficção Científica 1', author: 'Autor X', price: 'R$ 39,90', category: 'Ficção', image: book5 },
    { id: '6', title: 'Ficção Científica 2', author: 'Autor Y', price: 'R$ 29,90', category: 'Ficção', image: book6 },
  ];

  const produtosFiltrados = todosProdutos.filter(item => item.category === tipo);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={item.image} style={styles.bookImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <Text style={styles.bookPrice}>{item.price}</Text>

        {/* ✅ BOTÃO AJUSTADO */}
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() => navigation.navigate("BookDetails", { livro: item })}
        >
          <Text style={styles.buyButtonText}>Ver Detalhes</Text>
        </TouchableOpacity>

      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#AE0000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tipo}</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <FlatList
        data={produtosFiltrados}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum livro encontrado nesta categoria.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6EF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 22, fontFamily: 'PoppinsBold', color: '#AE0000' },
  listContent: { paddingHorizontal: 10, paddingBottom: 20 },
  columnWrapper: { justifyContent: 'space-between' },
  card: {
    backgroundColor: '#fff',
    width: (screenWidth / 2) - 20,
    borderRadius: 15,
    marginTop: 20,
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  bookImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  infoContainer: { marginTop: 10 },
  bookTitle: { fontSize: 14, fontFamily: 'PoppinsBold', color: '#333' },
  bookAuthor: { fontSize: 12, color: '#666', marginBottom: 5 },
  bookPrice: { fontSize: 16, fontFamily: 'PoppinsBold', color: '#AE0000' },
  buyButton: {
    backgroundColor: '#AE0000',
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buyButtonText: { color: '#fff', fontSize: 12, fontFamily: 'PoppinsSemiBold' },
  emptyText: { textAlign: 'center', marginTop: 50, fontFamily: 'PoppinsSemiBold', color: '#999' }
});