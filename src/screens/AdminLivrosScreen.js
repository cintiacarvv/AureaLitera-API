import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, Image, Alert, ActivityIndicator, ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.apiUrl;

const CATEGORIAS = ["Terror", "Autoajuda", "Ficção", "Romance", "Fantasia", "Suspense", "Biografia", "Infantil", "Outros"];
const FORMATOS = ["eBook", "Físico"];

export default function AdminLivrosScreen() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [format, setFormat] = useState("");
  const [price, setPrice] = useState("");
  const [pages, setPages] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => { loadBooks(); }, []);

  async function loadBooks() {
    try {
      const res = await fetch(`${API_URL}/api/books`);
      setBooks(await res.json());
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os livros. Verifique se o servidor está rodando.");
    }
  }

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [3, 4], quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  async function addBook() {
    if (!title || !author) return Alert.alert("Atenção", "Título e autor são obrigatórios.");
    if (!category) return Alert.alert("Atenção", "Selecione uma categoria.");
    if (!format) return Alert.alert("Atenção", "Selecione o formato do livro.");
    if (!rating) return Alert.alert("Atenção", "Selecione a nota do livro (1 a 5 estrelas).");

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, author, format,
          price: price ? parseFloat(price) : 0,
          cover_url: image || null,
          pages, category, description,
          rating,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Sucesso", "Livro salvo no banco de dados!");
        setImage(null); setTitle(""); setAuthor(""); setFormat("");
        setPrice(""); setPages(""); setCategory(""); setDescription(""); setRating(0);
        loadBooks();
      } else {
        Alert.alert("Erro", data.error || "Não foi possível salvar o livro.");
      }
    } catch {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteBook(id) {
    Alert.alert("Remover livro", "Tem certeza que deseja excluir este livro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir", style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/api/books/${id}`, { method: "DELETE" });
            if (res.ok) loadBooks();
            else Alert.alert("Erro", "Não foi possível excluir o livro.");
          } catch {
            Alert.alert("Erro", "Não foi possível conectar ao servidor.");
          }
        },
      },
    ]);
  }

  function renderItem({ item }) {
    return (
      <View style={styles.card}>
        {item.cover_url
          ? <Image source={{ uri: item.cover_url }} style={styles.bookImage} />
          : <View style={[styles.bookImage, styles.bookImagePlaceholder]}>
              <Ionicons name="book-outline" size={28} color="#ccc" />
            </View>
        }
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardText}>{item.author}</Text>
          <View style={styles.cardTags}>
            {item.format ? <View style={styles.tag}><Text style={styles.tagText}>{item.format}</Text></View> : null}
            {item.category ? <View style={styles.tag}><Text style={styles.tagText}>{item.category}</Text></View> : null}
          </View>
          {item.rating > 0 && (
            <View style={styles.cardStars}>
              {[1,2,3,4,5].map(i => (
                <Ionicons key={i} name="star" size={13}
                  color={i <= item.rating ? "#FFD700" : "#ddd"} />
              ))}
            </View>
          )}
        </View>
        <TouchableOpacity onPress={() => deleteBook(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash" size={22} color="#AE0000" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Admin de Livros</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.form}>

          <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
            <Ionicons name="image-outline" size={20} color="#AE0000" style={{ marginRight: 6 }} />
            <Text style={styles.imageBtnText}>{image ? "Trocar Imagem" : "Selecionar Imagem"}</Text>
          </TouchableOpacity>

          {image && <Image source={{ uri: image }} style={styles.previewImage} />}

          <TextInput placeholder="Nome do livro" value={title} onChangeText={setTitle} style={styles.input} />
          <TextInput placeholder="Autor" value={author} onChangeText={setAuthor} style={styles.input} />
          <TextInput placeholder="Preço (ex: 29.90)" value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" />
          <TextInput placeholder="Número de páginas" value={pages} onChangeText={setPages} style={styles.input} keyboardType="numeric" />

          {/* Formato */}
          <Text style={styles.sectionLabel}>Formato</Text>
          <View style={styles.optionRow}>
            {FORMATOS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.optionBtn, format === f && styles.optionBtnActive]}
                onPress={() => setFormat(f)}
              >
                <Ionicons
                  name={f === "eBook" ? "tablet-portrait-outline" : "book-outline"}
                  size={16}
                  color={format === f ? "#fff" : "#AE0000"}
                  style={{ marginRight: 5 }}
                />
                <Text style={[styles.optionBtnText, format === f && styles.optionBtnTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Categoria */}
          <Text style={styles.sectionLabel}>Categoria</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIAS.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryBtn, category === cat && styles.categoryBtnActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.categoryBtnText, category === cat && styles.categoryBtnTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Nota em estrelas */}
          <Text style={styles.sectionLabel}>Nota</Text>
          <View style={styles.starsRow}>
            {[1,2,3,4,5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)} style={styles.starBtn}>
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={36}
                  color={star <= rating ? "#FFD700" : "#ccc"}
                />
              </TouchableOpacity>
            ))}
            {rating > 0 && (
              <Text style={styles.ratingLabel}>{rating}/5</Text>
            )}
          </View>

          <TextInput
            placeholder="Descrição"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, { height: 80 }]}
            multiline
          />

          <TouchableOpacity style={styles.button} onPress={addBook} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Adicionar Livro</Text>
            }
          </TouchableOpacity>
        </View>

        <Text style={styles.listHeader}>Livros cadastrados</Text>

        <FlatList
          data={books}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum livro cadastrado ainda.</Text>}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF6EF", padding: 20 },
  header: { fontSize: 20, fontFamily: "PoppinsBold", color: "#AE0000", marginBottom: 20 },
  form: { marginBottom: 20 },
  input: {
    backgroundColor: "#fff", padding: 12, borderRadius: 12,
    marginBottom: 10, fontFamily: "PoppinsSemiBold", fontSize: 14,
  },
  imageBtn: {
    backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 10,
    alignItems: "center", flexDirection: "row", justifyContent: "center",
  },
  imageBtnText: { color: "#AE0000", fontFamily: "PoppinsBold" },
  previewImage: { width: 100, height: 140, borderRadius: 10, marginBottom: 10, alignSelf: "center" },
  sectionLabel: { fontFamily: "PoppinsBold", color: "#555", fontSize: 14, marginBottom: 8, marginTop: 4 },
  optionRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  optionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: "#AE0000", backgroundColor: "#fff",
  },
  optionBtnActive: { backgroundColor: "#AE0000" },
  optionBtnText: { color: "#AE0000", fontFamily: "PoppinsSemiBold", fontSize: 14 },
  optionBtnTextActive: { color: "#fff" },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  categoryBtn: {
    paddingVertical: 7, paddingHorizontal: 14, borderRadius: 20,
    borderWidth: 1.5, borderColor: "#AE0000", backgroundColor: "#fff",
  },
  categoryBtnActive: { backgroundColor: "#AE0000" },
  categoryBtnText: { color: "#AE0000", fontFamily: "PoppinsSemiBold", fontSize: 13 },
  categoryBtnTextActive: { color: "#fff" },
  starsRow: { flexDirection: "row", alignItems: "center", marginBottom: 14, gap: 4 },
  starBtn: { padding: 4 },
  ratingLabel: { fontFamily: "PoppinsBold", color: "#555", fontSize: 15, marginLeft: 6 },
  button: { backgroundColor: "#AE0000", padding: 15, borderRadius: 12, alignItems: "center", marginTop: 5 },
  buttonText: { color: "#fff", fontFamily: "PoppinsBold" },
  listHeader: { fontFamily: "PoppinsBold", fontSize: 16, color: "#555", marginBottom: 10 },
  card: {
    backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 10,
    flexDirection: "row", alignItems: "center", gap: 12,
  },
  bookImage: { width: 60, height: 85, borderRadius: 8 },
  bookImagePlaceholder: { backgroundColor: "#eee", justifyContent: "center", alignItems: "center" },
  cardTitle: { fontSize: 15, fontFamily: "PoppinsBold", color: "#333" },
  cardText: { fontSize: 13, color: "#666", marginTop: 2 },
  cardTags: { flexDirection: "row", gap: 6, marginTop: 6 },
  tag: { backgroundColor: "#FAE8E8", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontSize: 11, color: "#AE0000", fontFamily: "PoppinsSemiBold" },
  cardStars: { flexDirection: "row", marginTop: 5, gap: 2 },
  deleteBtn: { padding: 6 },
  emptyText: { textAlign: "center", color: "#999", fontFamily: "PoppinsSemiBold", marginTop: 20 },
});