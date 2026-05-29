import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, FlatList, Image,
  TouchableOpacity, Dimensions, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

import book1 from '../../assets/book1.jpg';
import book2 from '../../assets/book2.jpg';
import book3 from '../../assets/book3.jpg';
import book4 from '../../assets/book4.jpg';
import book5 from '../../assets/book5.jpg';
import book6 from '../../assets/book6.jpg';
import book7 from '../../assets/book7.jpg';

const screenWidth = Dimensions.get('window').width;
const API_URL = Constants.expoConfig.extra.apiUrl;

// ✅ Mesmas categorias e ícones do AdminLivrosScreen — fonte única de verdade
export const CATEGORIAS = [
  { label: "Terror",    icon: "skull-outline"    },
  { label: "Autoajuda", icon: "heart-outline"    },
  { label: "Ficção",    icon: "rocket-outline"   },
  { label: "Romance",   icon: "rose-outline"     },
  { label: "Fantasia",  icon: "sparkles-outline" },
  { label: "Suspense",  icon: "eye-outline"      },
  { label: "Biografia", icon: "person-outline"   },
  { label: "Infantil",  icon: "happy-outline"    },
  { label: "Outros",    icon: "grid-outline"     },
];

const livrosFixos = [
  { id: 'f1', title: 'The Shining',         author: 'Stephen King', price: 45.90,  category: 'Terror',    rating: 5, image: book1 },
  { id: 'f2', title: 'It: A Coisa',         author: 'Stephen King', price: 102.90, category: 'Terror',    rating: 5, image: book7 },
  { id: 'f3', title: 'A Sutil Arte',        author: 'Mark Manson',  price: 34.90,  category: 'Autoajuda', rating: 4, image: book2 },
  { id: 'f4', title: 'Bailarina Auschwitz', author: 'Edith Eger',   price: 42.00,  category: 'Autoajuda', rating: 5, image: book3 },
  { id: 'f5', title: 'Ficção Científica 1', author: 'Autor X',      price: 39.90,  category: 'Ficção',    rating: 3, image: book5 },
  { id: 'f6', title: 'Ficção Científica 2', author: 'Autor Y',      price: 29.90,  category: 'Ficção',    rating: 3, image: book6 },
];

export default function CategoriaScreen({ route, navigation }) {
  const { tipo, user } = route.params;
  const [livrosDB, setLivrosDB] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/books`)
      .then(res => res.json())
      .then(data => {
        const filtrados = data.filter(
          b => b.category && b.category.toLowerCase() === tipo.toLowerCase()
        );
        setLivrosDB(filtrados);
      })
      .catch(() => setLivrosDB([]))
      .finally(() => setLoading(false));
  }, [tipo]);

  const fixosFiltrados = livrosFixos.filter(
    item => item.category.toLowerCase() === tipo.toLowerCase()
  );

  const lista = [
    ...fixosFiltrados,
    ...livrosDB.map(b => ({ ...b, id: `db_${b.id}`, fromDB: true })),
  ];

  const renderItem = ({ item }) => {
    const imageSource = item.fromDB
      ? (item.cover_url ? { uri: item.cover_url } : null)
      : item.image;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('BookDetails', { book: item, user })}
      >
        {imageSource ? (
          <Image source={imageSource} style={styles.bookImage} />
        ) : (
          <View style={[styles.bookImage, styles.bookImagePlaceholder]}>
            <Ionicons name="book-outline" size={36} color="#ccc" />
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(i => (
              <Ionicons
                key={i}
                name={i <= (item.rating || 0) ? 'star' : 'star-outline'}
                size={12}
                color={i <= (item.rating || 0) ? '#FFD700' : '#ccc'}
              />
            ))}
          </View>

          <Text style={styles.bookPrice}>
            R$ {item.price ? Number(item.price).toFixed(2) : '0,00'}
          </Text>

          <TouchableOpacity
            style={styles.detailsBtn}
            onPress={() => navigation.navigate('BookDetails', { book: item, user })}
          >
            <Text style={styles.detailsBtnText}>Ver Detalhes</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const categoriaInfo = CATEGORIAS.find(
    c => c.label.toLowerCase() === tipo.toLowerCase()
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#AE0000" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          {categoriaInfo && (
            <Ionicons name={categoriaInfo.icon} size={22} color="#AE0000" style={{ marginRight: 6 }} />
          )}
          <Text style={styles.headerTitle}>{tipo}</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      {loading ? (
        <ActivityIndicator color="#AE0000" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={lista}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="book-outline" size={60} color="#ddd" />
              <Text style={styles.emptyTitle}>Nenhum livro ainda</Text>
              <Text style={styles.emptyText}>
                Nenhum livro de {tipo} foi cadastrado ainda.{'\n'}Volte em breve!
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6EF' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 15,
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center' },
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

  bookImage: { width: '100%', height: 180, borderRadius: 10, resizeMode: 'cover' },
  bookImagePlaceholder: { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },

  infoContainer: { marginTop: 10 },
  bookTitle: { fontSize: 14, fontFamily: 'PoppinsBold', color: '#333' },
  bookAuthor: { fontSize: 12, color: '#666', marginTop: 2 },
  starsRow: { flexDirection: 'row', gap: 2, marginTop: 5, marginBottom: 4 },
  bookPrice: { fontSize: 15, fontFamily: 'PoppinsBold', color: '#AE0000', marginBottom: 8 },

  detailsBtn: { backgroundColor: '#AE0000', borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  detailsBtnText: { color: '#fff', fontSize: 12, fontFamily: 'PoppinsSemiBold' },

  emptyContainer: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyTitle: { fontFamily: 'PoppinsBold', fontSize: 18, color: '#aaa', marginTop: 16, marginBottom: 8 },
  emptyText: { fontFamily: 'PoppinsSemiBold', fontSize: 14, color: '#bbb', textAlign: 'center', lineHeight: 22 },
});