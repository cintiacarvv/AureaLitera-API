import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function AdminLivrosScreen() {
  const [books, setBooks] = useState([]);

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [format, setFormat] = useState("");
  const [pages, setPages] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) return;

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

  function addBook() {
    if (!title || !author) return;

    const newBook = {
      id: Date.now().toString(),
      title,
      author,
      format,
      pages,
      category,
      description,
      image
    };

    setBooks([...books, newBook]);

    setImage(null);
    setTitle("");
    setAuthor("");
    setFormat("");
    setPages("");
    setCategory("");
    setDescription("");
  }

  function deleteBook(id) {
    setBooks(books.filter(item => item.id !== id));
  }

  function renderItem({ item }) {
    return (
      <View style={styles.card}>

        {item.image && (
          <Image source={{ uri: item.image }} style={styles.bookImage} />
        )}

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.author}</Text>
        <Text style={styles.text}>{item.format}</Text>
        <Text style={styles.text}>{item.pages} páginas</Text>
        <Text style={styles.text}>{item.category}</Text>

        <TouchableOpacity onPress={() => deleteBook(item.id)}>
          <Ionicons name="trash" size={22} color="#AE0000" />
        </TouchableOpacity>

      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.header}>Admin de Livros</Text>

      <View style={styles.form}>

        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Text style={styles.imageBtnText}>
            {image ? "Trocar Imagem" : "Selecionar Imagem"}
          </Text>
        </TouchableOpacity>

        {image && (
          <Image source={{ uri: image }} style={styles.previewImage} />
        )}

        <TextInput placeholder="Nome do livro" value={title} onChangeText={setTitle} style={styles.input} />
        <TextInput placeholder="Autor" value={author} onChangeText={setAuthor} style={styles.input} />
        <TextInput placeholder="Formato (eBook/Físico)" value={format} onChangeText={setFormat} style={styles.input} />
        <TextInput placeholder="Número de páginas" value={pages} onChangeText={setPages} style={styles.input} keyboardType="numeric" />
        <TextInput placeholder="Categoria" value={category} onChangeText={setCategory} style={styles.input} />
        <TextInput placeholder="Descrição" value={description} onChangeText={setDescription} style={[styles.input, { height: 80 }]} multiline />

        <TouchableOpacity style={styles.button} onPress={addBook}>
          <Text style={styles.buttonText}>Adicionar Livro</Text>
        </TouchableOpacity>

      </View>

      <FlatList
        data={books}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF6EF",
    padding: 20
  },

  header: {
    fontSize: 20,
    fontFamily: "PoppinsBold",
    color: "#AE0000",
    marginBottom: 20
  },

  form: {
    marginBottom: 20
  },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10
  },

  button: {
    backgroundColor: "#AE0000",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5
  },

  buttonText: {
    color: "#fff",
    fontFamily: "PoppinsBold"
  },

  imageBtn: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center"
  },

  imageBtnText: {
    color: "#AE0000",
    fontFamily: "PoppinsBold"
  },

  previewImage: {
    width: 100,
    height: 140,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "center"
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10
  },

  bookImage: {
    width: 80,
    height: 110,
    borderRadius: 8,
    marginBottom: 10
  },

  title: {
    fontSize: 16,
    fontFamily: "PoppinsBold"
  },

  text: {
    fontSize: 13,
    color: "#555"
  }
});