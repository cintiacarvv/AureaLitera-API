import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from 'expo-status-bar';

import { cartService } from '../services/cartService'; 

export default function BookDetailsScreen({ route, navigation }) {
  const book = route?.params?.book || route?.params?.livro;

  if (!book) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={50} color="#AE0000" />
        <Text style={styles.errorText}>Livro não encontrado</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>Voltar para Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleAddToCart = async () => {
    try {
      const res = await cartService.adicionarAoCarrinho(book);
      if (res.status === 200) {
        Alert.alert("Sacola", `${book.title} foi adicionado!`);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar na sacola.");
    }
  };

  const handleBuyNow = async () => {
    try {
      await cartService.adicionarAoCarrinho(book);
      navigation.navigate("Carrinho"); 
    } catch (error) {
      console.log(error);
    }
  };

  const imageSource = typeof book.image === 'string' ? { uri: book.image } : book.image;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="heart-outline" size={26} color="#555" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#AE0000', '#8E5050']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.card}
        >
          <View style={styles.imageShadow}>
            <Image source={imageSource} style={styles.bookImage} resizeMode="cover" />
          </View>

          <View style={styles.bookInfo}>
            <View style={styles.formatBadge}>
              <Text style={styles.formatText}>{book.format || "Físico"}</Text>
            </View>
            <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
            <Text style={styles.bookAuthor}>{book.author}</Text>
            <Text style={styles.price}>
              R$ {book.price ? Number(book.price).toFixed(2).replace('.', ',') : "0,00"}
            </Text>

            <View style={styles.ratingRow}>
              <View style={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons key={i} name="star" size={14} color="#FFD700" />
                ))}
              </View>
              <Text style={styles.ratingCount}>(124 avaliações)</Text>
            </View>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
                <Text style={styles.buyButtonText}>Comprar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                <Ionicons name="cart-outline" size={22} color="#AE0000" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.specsContainer}>
          <View style={styles.specItem}>
            <Ionicons name="book-outline" size={20} color="#AE0000" />
            <Text style={styles.specLabel}>Páginas</Text>
            <Text style={styles.specValue}>{book.pages || "320"}</Text>
          </View>
          <View style={styles.specDivider} />
          <View style={styles.specItem}>
            <Ionicons name="language-outline" size={20} color="#AE0000" />
            <Text style={styles.specLabel}>Idioma</Text>
            <Text style={styles.specValue}>PT-BR</Text>
          </View>
          <View style={styles.specDivider} />
          <View style={styles.specItem}>
            <Ionicons name="calendar-outline" size={20} color="#AE0000" />
            <Text style={styles.specLabel}>Ano</Text>
            <Text style={styles.specValue}>2023</Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.tabTitle}>Sinopse</Text>
          <Text style={styles.descriptionText}>
            {book.description || "Uma jornada emocionante através de palavras que cativam a alma. Este livro oferece uma perspectiva única sobre os desafios contemporâneos e a força do espírito humano."}
          </Text>
        </View>

        <View style={styles.reviewsContainer}>
          <View style={styles.reviewHeader}>
            <Text style={styles.tabTitle}>Avaliações</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todas (124)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.reviewCard}>
            <View style={styles.reviewUserRow}>
              <View style={styles.userAvatar}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
              <View>
                <Text style={styles.userName}>João de Deus</Text>
                <View style={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons key={i} name="star" size={12} color="#FFD700" />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewDate}>Hoje</Text>
            </View>
            <Text style={styles.reviewText}>História incrível e entrega super rápida! A edição está impecável.</Text>
          </View>

          {/* Avaliação 2 */}
          <View style={[styles.reviewCard, { marginTop: 12 }]}>
            <View style={styles.reviewUserRow}>
              <View style={[styles.userAvatar, { backgroundColor: '#555' }]}>
                <Text style={styles.avatarText}>MA</Text>
              </View>
              <View>
                <Text style={styles.userName}>Maria Antônia</Text>
                <View style={styles.stars}>
                  {[...Array(4)].map((_, i) => (
                    <Ionicons key={i} name="star" size={12} color="#FFD700" />
                  ))}
                  <Ionicons name="star-outline" size={12} color="#FFD700" />
                </View>
              </View>
              <Text style={styles.reviewDate}>Ontem</Text>
            </View>
            <Text style={styles.reviewText}>O conteúdo é maravilhoso, só achei que a capa poderia ser um pouco mais resistente. Mas vale muito a pena!</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF6EF" },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 15 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "#555", marginTop: 10 },
  backLink: { color: "#AE0000", marginTop: 15 },
  backButton: { paddingHorizontal: 15, paddingVertical: 10 },
  headerIcon: { padding: 10 },
  
  card: { width: "92%", height: 260, padding: 15, flexDirection: "row", alignItems: "center", marginVertical: 10, alignSelf: "center", borderRadius: 20, elevation: 12 },
  imageShadow: { elevation: 15, shadowColor: '#000', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5 },
  bookImage: { width: 125, height: 190, borderRadius: 10 },
  
  bookInfo: { flex: 1, marginLeft: 20, justifyContent: 'center' },
  formatBadge: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, marginBottom: 5 },
  formatText: { color: '#fff', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  bookTitle: { color: "#fff", fontWeight: 'bold', fontSize: 19, lineHeight: 24 },
  bookAuthor: { color: "rgba(255,255,255,0.8)", fontSize: 14, marginBottom: 5 },
  price: { color: "#fff", fontWeight: 'bold', fontSize: 22, marginVertical: 2 },
  
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  stars: { flexDirection: "row", marginRight: 5 },
  ratingCount: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },

  actionButtonsContainer: { flexDirection: "row", alignItems: "center" },
  buyButton: { backgroundColor: "#fff", paddingVertical: 10, paddingHorizontal: 22, borderRadius: 25, marginRight: 10, elevation: 3 },
  buyButtonText: { color: "#AE0000", fontWeight: 'bold', fontSize: 14 },
  addToCartButton: { backgroundColor: "#fff", width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 3 },

  specsContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', marginHorizontal: 15, paddingVertical: 15, borderRadius: 15, marginTop: -20, elevation: 4, marginBottom: 20 },
  specItem: { alignItems: 'center', flex: 1 },
  specLabel: { fontSize: 10, color: '#999', marginTop: 4 },
  specValue: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  specDivider: { width: 1, height: '80%', backgroundColor: '#eee' },

  descriptionContainer: { marginHorizontal: 20, marginBottom: 25 },
  tabTitle: { fontWeight: 'bold', fontSize: 18, color: "#333", marginBottom: 10 },
  descriptionText: { fontSize: 15, color: "#666", lineHeight: 24, textAlign: 'justify' },

  reviewsContainer: { marginHorizontal: 20, paddingBottom: 20 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  seeAllText: { color: '#AE0000', fontWeight: 'bold', fontSize: 13 },
  reviewCard: { backgroundColor: '#fff', padding: 15, borderRadius: 15, elevation: 2 },
  reviewUserRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, position: 'relative' },
  reviewDate: { position: 'absolute', right: 0, top: 0, fontSize: 10, color: '#999' },
  userAvatar: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#AE0000', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  userName: { fontWeight: 'bold', color: '#333', fontSize: 14 },
  reviewText: { color: '#666', fontSize: 13, fontStyle: 'italic' }
});