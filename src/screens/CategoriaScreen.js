import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native'; 
import { bookService } from '../services/bookService'; 

const screenWidth = Dimensions.get('window').width;

export default function CategoriaScreen({ route, navigation }) {
  const { tipo } = route.params;
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadCategoryBooks();
    }
  }, [isFocused]);

  async function loadCategoryBooks() {
    const todosOsLivros = await bookService.listarTodos();
    
    const filtrados = todosOsLivros.filter(item => item.category === tipo);
    setProdutosFiltrados(filtrados);
  }

  const renderItem = ({ item }) => {
    const imageSource = typeof item.image === 'string' ? { uri: item.image } : item.image;

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate("BookDetails", { book: item })}
      >
        <Image source={imageSource} style={styles.bookImage} />
        <View style={styles.infoContainer}>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.bookAuthor}>{item.author}</Text>
          
          <Text style={styles.bookPrice}>
            R$ {item.price ? Number(item.price).toFixed(2) : "0,00"}
          </Text>

          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => navigation.navigate("BookDetails", { book: item })}
          >
            <Text style={styles.buyButtonText}>Ver Detalhes</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

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
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum livro cadastrado em "{tipo}" ainda.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6EF' },
  header: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#AE0000' },
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
  bookTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  bookAuthor: { fontSize: 12, color: '#666', marginBottom: 5 },
  bookPrice: { fontSize: 16, fontWeight: 'bold', color: '#AE0000' },
  buyButton: {
    backgroundColor: '#AE0000',
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buyButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', paddingHorizontal: 20 }
});