import React, { useState } from "react";
import {
  StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "../context/CartContext";

const COLORS = {
  primary:    "#AE0000",
  background: "#FAF6EF",
  white:      "#FFFFFF",
  text:       "#333",
  textMuted:  "#888",
};

const METODOS = [
  { id: "pix",    label: "Pix",               sub: "Aprovação instantânea",    icon: "qr-code-outline"  },
  { id: "cartao", label: "Cartão de crédito",  sub: "Até 12x sem juros",        icon: "card-outline"     },
  { id: "boleto", label: "Boleto bancário",    sub: "Vencimento em 3 dias úteis", icon: "barcode-outline" },
];

export default function PagamentoScreen({ navigation, route }) {
  const [metodo, setMetodo] = useState("pix");
  const { clearCart } = useCart();

  const total = route.params?.total ?? "0.00";
  const user  = route.params?.user  || {};

  function handleConfirmar() {
    Alert.alert("Pedido confirmado!", "Seu pedido foi realizado com sucesso.", [
      {
        text: "OK",
        onPress: () => {
          clearCart();
          navigation.navigate("Home", { user });
        },
      },
    ]);
  }

  const btnLabel = metodo === "pix" ? "Gerar código Pix"
                 : metodo === "cartao" ? "Confirmar pagamento"
                 : "Gerar boleto";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />

      {/* Header */}
      <LinearGradient colors={["#AE0000", "#8B0000"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pagamento</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Total */}
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total a pagar</Text>
          <Text style={styles.totalValue}>R$ {total}</Text>
        </View>

        <Text style={styles.sectionLabel}>Forma de pagamento</Text>

        {METODOS.map((m) => {
          const ativo = metodo === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              style={[styles.card, ativo && styles.cardAtivo]}
              onPress={() => setMetodo(m.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconCircle, ativo && styles.iconCircleAtivo]}>
                <Ionicons name={m.icon} size={22} color={ativo ? COLORS.white : COLORS.textMuted} />
              </View>
              <View style={styles.metodoInfo}>
                <Text style={[styles.metodoLabel, ativo && styles.metodoLabelAtivo]}>{m.label}</Text>
                <Text style={styles.metodoSub}>{m.sub}</Text>
              </View>
              <Ionicons
                name={ativo ? "radio-button-on" : "radio-button-off"}
                size={22}
                color={ativo ? COLORS.primary : "#ccc"}
              />
            </TouchableOpacity>
          );
        })}

        <View style={styles.secureRow}>
          <Ionicons name="shield-checkmark-outline" size={15} color="#4CAF50" />
          <Text style={styles.secureText}>  Pagamento 100% seguro e criptografado</Text>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.payBtn} onPress={handleConfirmar} activeOpacity={0.85}>
          <Text style={styles.payBtnText}>{btnLabel}</Text>
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
        </TouchableOpacity>
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
  headerTitle: { color: COLORS.white, fontFamily: "PoppinsBold", fontSize: 18 },

  scrollContent: { padding: 16 },

  /* Total */
  totalBox: {
    backgroundColor: COLORS.white, borderRadius: 16,
    padding: 20, alignItems: "center", marginBottom: 24,
    elevation: 3, shadowColor: "#000", shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 5,
  },
  totalLabel: { fontFamily: "PoppinsSemiBold", color: COLORS.textMuted, fontSize: 13, marginBottom: 4 },
  totalValue: { fontFamily: "PoppinsBold",    color: COLORS.primary,   fontSize: 34 },

  sectionLabel: {
    fontFamily: "PoppinsBold", fontSize: 14, color: COLORS.textMuted,
    marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5,
  },

  /* Card método */
  card: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.white, borderRadius: 16,
    padding: 16, marginBottom: 10,
    borderWidth: 2, borderColor: "transparent",
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
  },
  cardAtivo: { borderColor: COLORS.primary, backgroundColor: "#fff8f8" },

  iconCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.background,
    alignItems: "center", justifyContent: "center",
  },
  iconCircleAtivo: { backgroundColor: COLORS.primary },

  metodoInfo:       { flex: 1, marginLeft: 14 },
  metodoLabel:      { fontFamily: "PoppinsBold",    fontSize: 15, color: COLORS.text },
  metodoLabelAtivo: { color: COLORS.primary },
  metodoSub:        { fontFamily: "PoppinsSemiBold", fontSize: 11, color: COLORS.textMuted, marginTop: 1 },

  secureRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", marginTop: 10,
  },
  secureText: { fontFamily: "PoppinsSemiBold", fontSize: 12, color: COLORS.textMuted },

  /* Footer */
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.white, padding: 16, paddingBottom: 24,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    elevation: 16, shadowColor: "#000", shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: -3 }, shadowRadius: 8,
  },
  payBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14,
    paddingVertical: 15, flexDirection: "row",
    alignItems: "center", justifyContent: "center", gap: 8,
  },
  payBtnText: { color: COLORS.white, fontFamily: "PoppinsBold", fontSize: 16 },
});