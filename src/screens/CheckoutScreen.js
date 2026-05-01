import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from '@react-navigation/native';
import { cartService } from '../services/cartService';

export default function CheckoutScreen({ navigation }) {
  const [carrinho, setCarrinho] = useState([]);
  const [endereco, setEndereco] = useState(null);
  const [tipoEntrega, setTipoEntrega] = useState("fisico");

  useFocusEffect(
    useCallback(() => {
      const carregarDados = async () => {
        const itens = await cartService.listarItens();
        setCarrinho(itens);

        setEndereco({
          label: "Casa",
          rua: "Rua Exemplo",
          numero: "123",
          cidade: "São Paulo",
          estado: "SP",
          cep: "00000-000"
        });
      };
      carregarDados();
    }, [])
  );

  const subtotal = carrinho.reduce((sum, item) => {
    const preco = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(',', '.')) 
      : item.price;
    return sum + (preco * (item.quantity || 1));
  }, 0);

  const frete = tipoEntrega === "fisico" ? 12.9 : 0;
  const total = subtotal + frete;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#AE0000" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Resumo dos itens</Text>

        {carrinho.map((item) => (
          <View key={item.id} style={styles.cardItem}>
            <Image 
              source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
              style={styles.img} 
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.sub}>{item.author}</Text>
              <Text style={styles.type}>
                {item.format === "E-book" ? "📱 DIGITAL" : "📦 FÍSICO"}
              </Text>
              <Text style={styles.price}>
                {item.quantity || 1}x R$ {typeof item.price === 'string' ? item.price : item.price.toFixed(2).replace('.', ',')}
              </Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Tipo de entrega</Text>
        <View style={styles.box}>
          <TouchableOpacity
            style={[styles.option, tipoEntrega === "fisico" && styles.optionActive]}
            onPress={() => setTipoEntrega("fisico")}
          >
            <Text style={tipoEntrega === "fisico" ? {color: '#AE0000', fontWeight: 'bold'} : {}}>📦 Físico</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, tipoEntrega === "ebook" && styles.optionActive]}
            onPress={() => setTipoEntrega("ebook")}
          >
            <Text style={tipoEntrega === "ebook" ? {color: '#AE0000', fontWeight: 'bold'} : {}}>📱 Digital</Text>
          </TouchableOpacity>
        </View>

        {tipoEntrega === "fisico" && (
          <View style={styles.card}>
            <Text style={styles.bold}>{endereco?.label}</Text>
            <Text>{endereco?.rua}, {endereco?.numero}</Text>
            <Text>{endereco?.cidade} - {endereco?.estado}</Text>
            <Text>CEP: {endereco?.cep}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Enderecos")}>
              <Text style={styles.link}>Alterar endereço</Text>
            </TouchableOpacity>
          </View>
        )}

        {tipoEntrega === "ebook" && (
          <View style={styles.card}>
            <Text style={styles.bold}>📚 Livro digital</Text>
            <Text>Após o pagamento, o livro será liberado na sua biblioteca.</Text>
            <View style={styles.highlightBox}>
              <Text style={styles.highlightText}>Meus Livros</Text>
            </View>
            <Text style={styles.info}>
              ✔ Acesso imediato{"\n"}
              ✔ Offline{"\n"}
              ✔ No app
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Resumo financeiro</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text>Subtotal</Text>
            <Text>R$ {subtotal.toFixed(2).replace('.', ',')}</Text>
          </View>
          <View style={styles.row}>
            <Text>Frete</Text>
            <Text>R$ {frete.toFixed(2).replace('.', ',')}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.total}>Total</Text>
            <Text style={styles.totalValue}>R$ {total.toFixed(2).replace('.', ',')}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Pagamento", { total: total.toFixed(2) })}
        >
          <Text style={styles.buttonText}>Ir para pagamento</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF6EF" },
  header: { backgroundColor: "#AE0000", flexDirection: "row", justifyContent: "space-between", padding: 20, paddingTop: 50, alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  content: { padding: 18, paddingBottom: 120 },
  sectionTitle: { fontSize: 15, fontWeight: "700", marginTop: 14, marginBottom: 10, color: "#333" },
  cardItem: { flexDirection: "row", backgroundColor: "#fff", padding: 12, borderRadius: 14, marginBottom: 10, elevation: 2 },
  img: { width: 60, height: 90, borderRadius: 10, marginRight: 12 },
  title: { fontWeight: "700", fontSize: 14, color: "#333" },
  sub: { fontSize: 12, color: "#777" },
  type: { fontSize: 11, color: "#AE0000", fontWeight: "bold", marginTop: 4 },
  price: { marginTop: 6, color: "#333", fontWeight: "700" },
  box: { flexDirection: "row", justifyContent: "space-between" },
  option: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 12, margin: 5, borderRadius: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: "#eee" },
  optionActive: { borderColor: "#AE0000", backgroundColor: "#fff5f5" },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 14, marginTop: 10, elevation: 2 },
  bold: { fontWeight: "700", marginBottom: 6 },
  highlightBox: { marginTop: 10, backgroundColor: "#e9f9ee", padding: 8, borderRadius: 8 },
  highlightText: { color: "#1B8F3A", fontWeight: "700" },
  info: { fontSize: 12, marginTop: 8, color: "#666" },
  link: { color: "#AE0000", marginTop: 8, fontWeight: "600" },
  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 3 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  total: { fontWeight: "700", fontSize: 15 },
  totalValue: { fontWeight: "800", fontSize: 17, color: "#AE0000" },
  footer: { position: "absolute", bottom: 0, width: "100%", padding: 16, backgroundColor: "#fff", borderTopLeftRadius: 18, borderTopRightRadius: 18, elevation: 10 },
  button: { backgroundColor: "#AE0000", padding: 15, borderRadius: 14, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" }
});