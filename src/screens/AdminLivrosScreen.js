import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { bookService } from "../services/bookService";
import { Picker } from '@react-native-picker/picker';

export default function AdminLivrosScreen() {
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null); 

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [format, setFormat] = useState("");
  const [pages, setPages] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("catalogo");
  const [category, setCategory] = useState("Terror");

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    const data = await bookService.listarTodos();
    setBooks(data);
  }

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permissão necessária", "Precisamos de acesso às suas fotos.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  function handleEditPress(book) {
    setEditingId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setPrice(book.price);
    setFormat(book.format || "");
    setPages(book.pages || "");
    setDescription(book.description || "");
    setLocation(book.location);
    setCategory(book.category);
    setImage(book.image);
  }

  async function handleSave() {
    if (!title || !author || !image || !price) {
      Alert.alert("Erro", "Preencha nome, autor, preço e selecione uma imagem.");
      return;
    }

    const bookData = {
      id: editingId ? editingId : Date.now().toString(),
      title,
      author,
      price,
      format,
      pages,
      location,
      category: location === "categorias" ? category : "Geral",
      description,
      image
    };

    if (editingId) {
      await bookService.atualizar(bookData);
      Alert.alert("Sucesso", "Livro atualizado com sucesso!");
    } else {
      const livrosNoLocal = books.filter(b => b.location === location);
      
      if (location === "catalogo" && livrosNoLocal.length >= 6) {
        Alert.alert("Limite", "O catálogo vermelho já possui 6 livros.");
        return;
      }
      
      if (location === "recomendados" && livrosNoLocal.length >= 5) {
        Alert.alert("Limite", "A seção de recomendados já possui 5 livros.");
        return;
      }

      await bookService.salvar(bookData);
      Alert.alert("Sucesso", "Livro adicionado com sucesso!");
    }

    resetForm();
    await loadBooks();
  }

  function resetForm() {
    setEditingId(null);
    setImage(null);
    setTitle("");
    setAuthor("");
    setPrice("");
    setFormat("");
    setPages("");
    setDescription("");
  }

  async function deleteBook(id) {
    Alert.alert("Confirmar", "Deseja excluir este livro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", onPress: async () => {
          await bookService.remover(id);
          await loadBooks();
        } 
      }
    ]);
  }

  function renderItem({ item }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardRow}>
          {item.image && <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.bookImage} />}
          <View style={styles.cardInfo}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>R$ {item.price}</Text>
            <Text style={styles.text}>Local: {item.location}</Text>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => handleEditPress(item)} style={styles.iconBtn}>
              <Ionicons name="pencil" size={22} color="#0055AE" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteBook(item.id)} style={styles.iconBtn}>
              <Ionicons name="trash" size={22} color="#AE0000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.form}>
            <View style={styles.headerRow}>
               <Text style={styles.header}>Gerenciar Acervo</Text>
               {editingId && (
                 <TouchableOpacity onPress={resetForm}>
                   <Text style={styles.cancelText}>Cancelar Edição</Text>
                 </TouchableOpacity>
               )}
            </View>
            
            <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
              {image ? (
                <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.previewImage} />
              ) : (
                <View style={styles.placeholderImg}>
                  <Ionicons name="camera" size={30} color="#AE0000" />
                  <Text style={styles.imageBtnText}>Capa do Livro</Text>
                </View>
              )}
            </TouchableOpacity>

            <TextInput placeholder="Nome do livro" value={title} onChangeText={setTitle} style={styles.input} />
            <TextInput placeholder="Autor" value={author} onChangeText={setAuthor} style={styles.input} />
            <TextInput placeholder="Preço (Ex: 49.90)" value={price} onChangeText={setPrice} style={styles.input} keyboardType="numeric" />

            <Text style={styles.label}>Onde este livro será exibido?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={location}
                onValueChange={(itemValue) => setLocation(itemValue)}
              >
                <Picker.Item label="Catálogo Vermelho (Home)" value="catalogo" />
                <Picker.Item label="Recomendados (Home)" value="recomendados" />
                <Picker.Item label="Menu Lateral (Categorias)" value="categorias" />
              </Picker>
            </View>

            {location === "categorias" && (
              <>
                <Text style={styles.label}>Selecione o Gênero:</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={category}
                    onValueChange={(itemValue) => setCategory(itemValue)}
                  >
                    <Picker.Item label="Terror" value="Terror" />
                    <Picker.Item label="Ficção" value="Ficção" />
                    <Picker.Item label="Autoajuda" value="Autoajuda" />
                  </Picker>
                </View>
              </>
            )}

            <TextInput placeholder="Páginas" value={pages} onChangeText={setPages} style={styles.input} keyboardType="numeric" />
            <TextInput placeholder="Descrição" value={description} onChangeText={setDescription} style={[styles.input, { height: 60 }]} multiline />

            <TouchableOpacity 
               style={[styles.button, editingId && { backgroundColor: '#0055AE' }]} 
               onPress={handleSave}
            >
              <Text style={styles.buttonText}>
                {editingId ? "Atualizar Livro" : "Salvar no Sistema"}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.header, { marginTop: 30 }]}>Livros no Sistema</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF6EF" },
  form: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  header: { fontSize: 22, color: "#AE0000", fontWeight: "bold" },
  cancelText: { color: '#666', fontWeight: 'bold', textDecorationLine: 'underline' },
  label: { fontSize: 14, color: "#333", marginBottom: 5, fontWeight: "600" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: "#ddd" },
  pickerContainer: { backgroundColor: "#fff", borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: "#ddd", overflow: "hidden" },
  button: { backgroundColor: "#AE0000", padding: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  imageBtn: { alignSelf: 'center', marginBottom: 20 },
  previewImage: { width: 120, height: 160, borderRadius: 10 },
  placeholderImg: { width: 120, height: 160, borderRadius: 10, backgroundColor: "#eee", justifyContent: "center", alignItems: "center", borderStyle: "dashed", borderWidth: 1, borderColor: "#AE0000" },
  imageBtnText: { color: "#AE0000", fontSize: 12, marginTop: 5 },
  card: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 10, marginHorizontal: 20, elevation: 2 },
  cardRow: { flexDirection: "row", alignItems: "center" },
  bookImage: { width: 50, height: 70, borderRadius: 5, marginRight: 15 },
  cardInfo: { flex: 1 },
  actionButtons: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 5, marginLeft: 10 },
  title: { fontWeight: "bold", fontSize: 14 },
  text: { fontSize: 12, color: "#666" }
});