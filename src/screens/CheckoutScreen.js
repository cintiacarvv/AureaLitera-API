import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Image, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { useCart } from "../context/CartContext";

const API_URL = Constants.expoConfig.extra.apiUrl;
const FRETE   = 12.9;

const COLORS = {
  primary:   "#AE0000",
  background:"#FAF6EF",
  white:     "#FFFFFF",
  text:      "#333",
  textMuted: "#888",
  lightGray: "#F0EDE8",
};

// formato vem como "eBook" ou "Físico" do banco
const isFisico = (item) => {
  const f = (item.format || item.formato || "").toLowerCase();
  return f === "físico" || f === "fisico";
};

export default function CheckoutScreen({ navigation, route }) {
  const user = route?.params?.user || {};
  const { cartItems } = useCart();

  const [endereco,   setEndereco]   = useState(null);
  const [loadingEnd, setLoadingEnd] = useState(false);

  const temFisico = cartItems.some(isFisico);
  const subtotal  = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const frete     = temFisico ? FRETE : 0;
  const total     = subtotal + frete;

  useEffect(() => {
    if (!temFisico || !user?.id) return;
    setLoadingEnd(true);
    fetch(`${API_URL}/api/users/${user.id}`)
      .then((r) => r.json())
      .then((d) => { if (d.street) setEndereco(d); })
      .catch(() => {})
      .finally(() => setLoadingEnd(false));
  }, []);

  const getImage = (item) => {
    if (item.cover_url)                        return { uri: item.cover_url };
    if (item.image_url)                        return { uri: item.image_url };
    if (typeof item.image === "string")        return { uri: item.image };
    if (item.image)                            return item.image;
    return null;
  };

  const podeAvancar = !temFisico || !!endereco;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />

      <LinearGradient colors={["#AE0000", "#8B0000"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resumo do pedido</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── ITENS ── */}
        {cartItems.map((item) => {
          const img     = getImage(item);
          const fisico  = isFisico(item);
          const formato = item.format || item.formato || "eBook";

          return (
            <View key={String(item.id)} style={styles.card}>
              {img ? (
                <Image source={img} style={styles.bookImg} resizeMode="cover" />
              ) : (
                <LinearGradient colors={["#AE0000", "#6B0000"]} style={[styles.bookImg, styles.bookImgPlaceholder]}>
                  <Text style={styles.placeholderTxt}>
                    {item.title?.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                  </Text>
                </LinearGradient>
              )}

              <View style={styles.itemInfo}>
                <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.bookAuthor}>{item.author}</Text>

                {/* Badge formato */}
                <View style={[styles.badge, fisico ? styles.badgeFisico : styles.badgeEbook]}>
                  <Ionicons
                    name={fisico ? "cube-outline" : "tablet-portrait-outline"}
                    size={11}
                    color={fisico ? "#E65100" : "#1B8F3A"}
                  />
                  <Text style={[styles.badgeTxt, fisico ? styles.badgeFisicoTxt : styles.badgeEbookTxt]}>
                    {"  "}{formato}
                  </Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.qty}>{item.quantity}x  R$ {Number(item.price).toFixed(2)}</Text>
                  <Text style={styles.subtotalItem}>R$ {(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              </View>
            </View>
          );
        })}

        {/* ── ENDEREÇO (só se tiver físico) ── */}
        {temFisico && (
          <>
            <Text style={styles.sectionLabel}>Endereço de entrega</Text>
            {loadingEnd ? (
              <View style={styles.card}>
                <ActivityIndicator color={COLORS.primary} style={{ padding: 10 }} />
              </View>
            ) : endereco ? (
              <View style={styles.card}>
                <Ionicons name="location-outline" size={22} color={COLORS.primary} style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.bookTitle}>
                    {endereco.street}, {endereco.number || "s/n"}
                    {endereco.complement ? ` — ${endereco.complement}` : ""}
                  </Text>
                  {endereco.neighborhood ? <Text style={styles.bookAuthor}>{endereco.neighborhood}</Text> : null}
                  <Text style={styles.bookAuthor}>
                    {endereco.city}{endereco.state ? ` — ${endereco.state}` : ""}
                    {endereco.cep ? `  ·  CEP ${endereco.cep}` : ""}
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate("Perfil", { user })} style={styles.linkRow}>
                    <Ionicons name="create-outline" size={13} color={COLORS.primary} />
                    <Text style={styles.link}>  Alterar no perfil</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={[styles.card, { backgroundColor: "#FEF3C7" }]}>
                <Ionicons name="alert-circle-outline" size={22} color="#b45309" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bookTitle, { color: "#92400E" }]}>Endereço não cadastrado</Text>
                  <Text style={[styles.bookAuthor, { color: "#78350F" }]}>
                    Cadastre seu endereço no perfil para continuar.
                  </Text>
                  <TouchableOpacity onPress={() => navigation.navigate("Perfil", { user })} style={styles.linkRow}>
                    <Text style={styles.link}>Ir para o perfil →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}

        {/* ── AVISO EBOOK ── */}
        {cartItems.some((i) => !isFisico(i)) && (
          <View style={styles.ebookAviso}>
            <Ionicons name="information-circle-outline" size={18} color="#1565C0" />
            <Text style={styles.ebookAvisoTxt}>
              {"  "}Após o pagamento, os e-books ficarão disponíveis em <Text style={{ fontFamily: "PoppinsBold" }}>Meus Livros</Text>.
            </Text>
          </View>
        )}

        {/* ── RESUMO FINANCEIRO ── */}
        <Text style={styles.sectionLabel}>Resumo</Text>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal ({cartItems.length} {cartItems.length === 1 ? "item" : "itens"})
            </Text>
            <Text style={styles.summaryValue}>R$ {subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Frete</Text>
            <Text style={[styles.summaryValue, { color: frete === 0 ? "#2E7D32" : COLORS.text }]}>
              {frete === 0 ? "Grátis" : `R$ ${frete.toFixed(2)}`}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, !podeAvancar && styles.btnDisabled]}
          disabled={!podeAvancar}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Pagamento", { total: total.toFixed(2), user })}
        >
          <Text style={styles.btnTxt}>Ir para pagamento</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
        {temFisico && !endereco && !loadingEnd && (
          <Text style={styles.footerWarn}>Cadastre um endereço no perfil para continuar.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 16,
  },
  headerTitle: { color: "#fff", fontFamily: "PoppinsBold", fontSize: 18 },
  scroll:      { padding: 16 },

  sectionLabel: {
    fontFamily: "PoppinsBold", fontSize: 13, color: COLORS.textMuted,
    textTransform: "uppercase", letterSpacing: 0.5,
    marginTop: 16, marginBottom: 8,
  },

  card: {
    flexDirection: "row", backgroundColor: COLORS.white,
    borderRadius: 16, padding: 14, marginBottom: 10,
    elevation: 3, shadowColor: "#000", shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 5,
    alignItems: "center",
  },

  bookImg:         { width: 68, height: 100, borderRadius: 9 },
  bookImgPlaceholder: { justifyContent: "center", alignItems: "center" },
  placeholderTxt:  { color: "rgba(255,255,255,0.7)", fontFamily: "PoppinsBold", fontSize: 18 },

  itemInfo:    { flex: 1, marginLeft: 14 },
  bookTitle:   { fontFamily: "PoppinsBold",    fontSize: 14, color: COLORS.text, marginBottom: 2 },
  bookAuthor:  { fontFamily: "PoppinsSemiBold", fontSize: 12, color: COLORS.textMuted, marginBottom: 6 },

  badge: {
    flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, marginBottom: 8,
  },
  badgeFisico:    { backgroundColor: "#FFF3E0" },
  badgeEbook:     { backgroundColor: "#E8F5E9" },
  badgeTxt:       { fontSize: 11, fontFamily: "PoppinsBold" },
  badgeFisicoTxt: { color: "#E65100" },
  badgeEbookTxt:  { color: "#1B8F3A" },

  priceRow:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  qty:          { fontFamily: "PoppinsSemiBold", fontSize: 13, color: COLORS.textMuted },
  subtotalItem: { fontFamily: "PoppinsBold",    fontSize: 14, color: COLORS.primary },

  linkRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  link:    { color: COLORS.primary, fontFamily: "PoppinsBold", fontSize: 12 },

  ebookAviso: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#E3F2FD", padding: 12,
    borderRadius: 12, marginTop: 4, marginBottom: 2,
  },
  ebookAvisoTxt: { fontFamily: "PoppinsSemiBold", fontSize: 12, color: "#1565C0", flex: 1 },

  summaryBox: {
    backgroundColor: COLORS.white, borderRadius: 16, padding: 18,
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
  },
  summaryRow:   { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  summaryLabel: { fontFamily: "PoppinsSemiBold", fontSize: 14, color: COLORS.textMuted },
  summaryValue: { fontFamily: "PoppinsSemiBold", fontSize: 14, color: COLORS.text },
  summaryTotal: { borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 12, marginBottom: 0 },
  totalLabel:   { fontFamily: "PoppinsBold", fontSize: 16, color: COLORS.text },
  totalValue:   { fontFamily: "PoppinsBold", fontSize: 20, color: COLORS.primary },

  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.white, padding: 16, paddingBottom: 24,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    elevation: 16,
  },
  btn: {
    backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 15,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },
  btnDisabled: { backgroundColor: "#ccc" },
  btnTxt:      { color: "#fff", fontFamily: "PoppinsBold", fontSize: 16 },
  footerWarn:  { textAlign: "center", color: "#b45309", fontFamily: "PoppinsSemiBold", fontSize: 12, marginTop: 6 },
});