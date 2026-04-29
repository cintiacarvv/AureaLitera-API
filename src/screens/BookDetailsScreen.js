import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from 'expo-status-bar';

export default function BookDetailsScreen({ route, navigation }) {

  // ✅ CORREÇÃO AQUI
  const book = route?.params?.book || route?.params?.livro;

  // ✅ PROTEÇÃO PARA NÃO QUEBRAR
  if (!book) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Erro ao carregar o livro</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="#555" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        <LinearGradient
          colors={['#AE0000', '#8E5050']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.card}
        >
          <Image source={book.image} style={styles.bookImage} />

          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>{book.author}</Text>

            <Text style={styles.price}>
              R$ {book.price ? Number(book.price).toFixed(2) : "0,00"}
            </Text>

            <View style={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <Ionicons key={i} name="star" size={18} color="#FFD700" />
              ))}
            </View>

            <View style={styles.buyButtonContainer}>
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => navigation.navigate("Carrinho", { book })}
              >
                <Text style={styles.buyButtonText}>Comprar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Autor</Text>
            <Text style={styles.detailValue}>{book.author}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Formato</Text>
            <Text style={styles.detailValue}>{book.formato || "eBook"}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Páginas</Text>
            <Text style={styles.detailValue}>{book.paginas || "-"}</Text>
          </View>
        </View>

        <View style={styles.genreContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Categoria", { tipo: book.category })
            }
          >
            <Text style={styles.genreTag}>{book.category}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.tabTitle}>Descrição</Text>
          <Text style={styles.descriptionText}>
            {book.descricao || "Sem descrição disponível."}
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF6EF",
  },

  backButton: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  card: {
    width: "90%",
    height: 270,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center",
    borderRadius: 10,
  },

  bookImage: {
    width: 110,
    height: 180,
    borderRadius: 10,
  },

  bookInfo: {
    flex: 1,
    marginLeft: 15,
  },

  bookTitle: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: 18,
  },

  bookAuthor: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
    marginBottom: 8,
  },

  price: {
    color: "#fff",
    fontFamily: "PoppinsSemiBold",
    fontSize: 16,
  },

  rating: {
    flexDirection: "row",
    marginVertical: 10,
  },

  buyButtonContainer: {
    alignItems: "flex-end",
    marginTop: 10,
  },

  buyButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 25,
  },

  buyButtonText: {
    color: "#AE0000",
    fontFamily: "PoppinsBold",
  },

  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 15,
    marginBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },

  detailItem: {
    alignItems: "center",
  },

  detailLabel: {
    fontFamily: "PoppinsBold",
    fontSize: 14,
    color: "#555",
  },

  detailValue: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 13,
    color: "#555",
  },

  genreContainer: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginBottom: 15,
  },

  genreTag: {
    backgroundColor: "#AE0000",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 13,
    fontFamily: "PoppinsSemiBold",
  },

  descriptionContainer: {
    marginHorizontal: 15,
    paddingTop: 10,
  },

  tabTitle: {
    fontFamily: "PoppinsBold",
    fontSize: 16,
    marginBottom: 8,
  },

  descriptionText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    textAlign: "justify",
  },
});