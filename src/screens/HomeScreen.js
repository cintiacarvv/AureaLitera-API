import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { SafeAreaView } from "react-native-safe-area-context";

import { LinearGradient } from "expo-linear-gradient";

import { StatusBar } from "expo-status-bar";

import { useIsFocused } from "@react-navigation/native";

import { bookService } from "../services/bookService";

const COLORS = {
  primary: "#AE0000",

  background: "#FAF6EF",

  white: "#FFFFFF",

  gray: "#999",

  text: "#333",
};

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen({ navigation, route }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const [catalogBooks, setCatalogBooks] = useState([]);

  const [recommendedBooks, setRecommendedBooks] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [cep, setCep] = useState("");

  const isFocused = useIsFocused();

  const { isAdmin } = route.params || {};

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  async function loadData() {
    const data = await bookService.listarTodos();

    setCatalogBooks(data.filter((b) => b.location === "catalogo"));

    setRecommendedBooks(data.filter((b) => b.location === "recomendados"));
  }

  const filterBooks = (books) => {
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  const handleConsultarFrete = () => {
    if (cep.length < 8) {
      Alert.alert("Erro", "Por favor, digite um CEP válido.");

      return;
    }

    Alert.alert(
      "Frete",
      `O frete para o CEP ${cep} é de R$ 12,90 com entrega em até 3 dias úteis.`,
    );
  };

  const handleNavigate = (categoria) => {
    setMenuVisible(false);

    navigation.navigate("Categoria", { tipo: categoria });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#AE0000" />

      <View style={styles.statusBarAbsolute} />

      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Categorias</Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("Terror")}
            >
              <Ionicons name="skull-outline" size={22} color={COLORS.primary} />

              <Text style={styles.menuItemText}>Terror</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("Autoajuda")}
            >
              <Ionicons name="heart-outline" size={22} color={COLORS.primary} />

              <Text style={styles.menuItemText}>Autoajuda</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigate("Ficção")}
            >
              <Ionicons
                name="rocket-outline"
                size={22}
                color={COLORS.primary}
              />

              <Text style={styles.menuItemText}>Ficção</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={{ height: 60 }} />

        <View style={styles.header}>
          <Text style={styles.headerText}>
            Olá, {isAdmin ? "Adm" : "Cintia"}!
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Ionicons name="menu" size={37} color="#555" />
          </TouchableOpacity>

          <View style={styles.searchBox}>
            <TextInput
              placeholder="Pesquisar título ou autor..."
              style={styles.input}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <Ionicons name="search" size={20} color="#555" />
          </View>
        </View>

        {!searchQuery && (
          <>
            <Text style={styles.sectionTitle}>Continue Lendo...</Text>

            <LinearGradient
              colors={["#AE0000", "#8E5050"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.card}
            >
              <Image
                source={{
                  uri: "https://covers.openlibrary.org/b/id/8231996-L.jpg",
                }}
                style={styles.bookImage}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>The Shining</Text>

                <Text style={styles.cardAuthor}>Stephen King</Text>
              </View>

              <View style={styles.progress}>
                <Text style={styles.progressText}>79%</Text>
              </View>
            </LinearGradient>

            <View style={styles.promoBannerContainer}>
              <View style={styles.promoBadge}>
                <Text style={styles.promoBadgeText}>
                  10% OFF em Frankenstein
                </Text>
              </View>

              <Image
                source={require("../../assets/carrossel_1.jpg")}
                style={styles.promoImage}
                resizeMode="cover"
              />
            </View>
          </>
        )}

        <View style={styles.popularContainer}>
          <Text style={styles.popularTitle}>
            Catálogo ÁureaLítera {isAdmin && !searchQuery && "(Admin)"}
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filterBooks(catalogBooks).length > 0 ? (
              filterBooks(catalogBooks).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() =>
                    navigation.navigate("BookDetails", { book: item })
                  }
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.popularBook}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ color: "#fff", marginLeft: 15, fontSize: 12 }}>
                Nenhum livro no catálogo vermelho.
              </Text>
            )}
          </ScrollView>
        </View>

        <View style={styles.recommendedContainer}>
          <Text style={styles.recommendedTitle}>Recomendados para você</Text>

          {filterBooks(recommendedBooks).length > 0 ? (
            filterBooks(recommendedBooks).map((book) => (
              <TouchableOpacity
                key={book.id}
                style={styles.recommendedBookCard}
                onPress={() => navigation.navigate("BookDetails", { book })}
              >
                <Image
                  source={{ uri: book.image }}
                  style={styles.recommendedBookImage}
                />

                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>{book.title}</Text>

                  <Text style={styles.bookAuthor}>{book.author}</Text>

                  <View style={styles.rating}>
                    <Ionicons name="star" size={16} color="#FFD700" />

                    <Text style={styles.ratingText}>R$ {book.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ color: "#999", textAlign: "center" }}>
              Nenhum recomendado cadastrado.
            </Text>
          )}
        </View>

        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <Ionicons name="rocket-outline" size={28} color={COLORS.primary} />

            <Text style={styles.benefitText}>Entrega Jato</Text>
          </View>

          <View style={styles.benefitItem}>
            <Ionicons
              name="shield-checkmark-outline"
              size={28}
              color={COLORS.primary}
            />

            <Text style={styles.benefitText}>Compra Segura</Text>
          </View>

          <View style={styles.benefitItem}>
            <Ionicons name="sync-outline" size={28} color={COLORS.primary} />

            <Text style={styles.benefitText}>Troca Fácil</Text>
          </View>
        </View>

        <View style={styles.shippingSection}>
          <View style={styles.shippingCard}>
            <Text style={styles.shippingTitle}>Consulte seu frete</Text>

            <View style={styles.shippingInputRow}>
              <TextInput
                style={styles.shippingInput}
                placeholder="00000-000"
                keyboardType="numeric"
                maxLength={8}
                value={cep}
                onChangeText={setCep}
              />

              <TouchableOpacity
                style={styles.shippingButton}
                onPress={handleConsultarFrete}
              >
                <Text style={styles.shippingButtonText}>CALCULAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerBrandSection}>
            <Text style={styles.footerBrandName}>AUREALITERA</Text>

            <Text style={styles.footerTagline}>
              Curadoria literária de excelência.
            </Text>
          </View>

          <View style={styles.footerSocial}>
            <Ionicons name="logo-instagram" size={18} color="#444" />

            <Text style={styles.footerSocialText}>@AureaLitera</Text>
          </View>

          <View style={styles.footerDevs}>
            <Text style={styles.footerDevTitle}>C-Level Executives:</Text>

            <Text style={styles.footerDevText}>Cintia Oliveira - CEO</Text>

            <Text style={styles.footerDevText}>Vinicius Avarelo - CEO</Text>

            <Text style={styles.footerDevText}>Melvin Expedito - CEO</Text>
          </View>

          <View style={styles.footerInfo}>
            <Text style={styles.footerInfoText}>CNPJ: 42.100.333/0001-99</Text>

            <Text style={styles.footerInfoText}>
              Av. Lins de Vasconcelos, 1222 - Cambuci, SP
            </Text>
          </View>

          <View style={styles.footerLegal}>
            <Text style={styles.footerLegalText}>
              © 2026 AureaLitera. ADS SENAC SP.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomTab}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home", { isAdmin })}
        >
          <Ionicons name="home" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Carrinho")}>
          <Ionicons name="bag" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Biblioteca")}>
          <Ionicons name="book" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Perfil", { isAdmin })}
        >
          <Ionicons name="person" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  statusBarAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: COLORS.primary,
    zIndex: 10,
  },

  header: { paddingHorizontal: 25 },

  headerText: { fontSize: 28, color: "#555", fontWeight: "bold" },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 30,
    marginLeft: 10,
  },

  input: { flex: 1, marginHorizontal: 10 },

  sectionTitle: {
    marginHorizontal: 15,
    marginTop: 15,
    fontWeight: "bold",
    color: "#555",
  },

  card: {
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  bookImage: { width: 50, height: 70, borderRadius: 5, marginRight: 10 },

  cardTitle: { color: "#fff", fontWeight: "bold" },

  cardAuthor: { color: "#fff", fontSize: 12 },

  progress: {
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 10,
    borderRadius: 50,
  },

  progressText: { color: "#fff" },

  promoBannerContainer: {
    marginHorizontal: 20,

    marginTop: 20,

    backgroundColor: "#fff",

    overflow: "hidden",

    elevation: 4,

    shadowColor: "#000",

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.15,

    shadowRadius: 4,
  },

  promoBadge: {
    backgroundColor: "#000",
    paddingVertical: 10,
    alignItems: "center",
  },

  promoBadgeText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  promoImage: { width: "100%", height: 260 },

  popularContainer: {
    backgroundColor: COLORS.primary,
    marginTop: 20,
    paddingVertical: 15,
  },

  popularTitle: {
    color: COLORS.white,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 10,
  },

  popularBook: { width: 100, height: 150, marginLeft: 15, borderRadius: 10 },

  recommendedContainer: { marginHorizontal: 15, marginTop: 20 },

  recommendedTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#555",
    marginBottom: 15,
  },

  recommendedBookCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
  },

  recommendedBookImage: {
    width: 70,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },

  bookInfo: { flex: 1, justifyContent: "space-between" },

  bookTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },

  bookAuthor: { fontSize: 14, color: "#666" },

  rating: { flexDirection: "row", alignItems: "center" },

  ratingText: { marginLeft: 5, color: "#AE0000", fontWeight: "bold" },

  benefitsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 25,
    backgroundColor: "#fff",
    marginTop: 20,
  },

  benefitItem: { alignItems: "center" },

  benefitText: { fontSize: 12, color: "#666", marginTop: 6, fontWeight: "500" },

  shippingSection: { padding: 20 },

  shippingCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 2,
  },

  shippingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 12,
  },

  shippingInputRow: { flexDirection: "row", alignItems: "center" },

  shippingInput: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  shippingButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },

  shippingButtonText: { color: "#fff", fontWeight: "bold", fontSize: 13 },

  footer: {
    backgroundColor: "#F3EDE4",
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 60,
    borderTopWidth: 1,
    borderColor: "#E5DED5",
  },

  footerBrandName: {
    fontWeight: "bold",
    fontSize: 20,
    letterSpacing: 4,
    color: "#333",
    textAlign: "center",
  },

  footerTagline: {
    fontSize: 11,
    color: "#777",
    textAlign: "center",
    marginBottom: 15,
  },

  footerSocial: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  footerSocialText: {
    marginLeft: 8,
    color: "#444",
    fontWeight: "bold",
    fontSize: 14,
  },

  footerDevs: { alignItems: "center", marginBottom: 15 },

  footerDevTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 8,
  },

  footerDevText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 4,
  },

  footerInfo: { alignItems: "center", marginBottom: 15 },

  footerInfoText: { fontSize: 10, color: "#888", marginBottom: 2 },

  footerLegal: {
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#DDD",
    paddingTop: 10,
  },

  footerLegalText: { fontSize: 9, color: "#AAA" },

  bottomTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.primary,
    padding: 15,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
  },

  menuContainer: {
    backgroundColor: "#FAF6EF",
    width: "70%",
    height: "100%",
    paddingTop: 50,
    paddingHorizontal: 20,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },

  menuTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#AE0000",
    marginBottom: 30,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  menuItemText: { fontSize: 18, marginLeft: 15, color: "#555" },
});
