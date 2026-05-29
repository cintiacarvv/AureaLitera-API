import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Constants from 'expo-constants';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

const API_URL = Constants.expoConfig.extra.apiUrl; // mesmo IP do projeto

export default function NovaSenhaScreen({ navigation, route }) {
  const { email } = route.params;

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarNova, setMostrarNova] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const senhaValida = novaSenha.length >= 6;
  const senhasIguais = novaSenha === confirmarSenha;
  const formValido = senhaValida && senhasIguais && confirmarSenha.length > 0;

  async function handleSalvar() {
    if (!formValido) return;

    setCarregando(true);
    try {
      const response = await fetch(`${API_URL}/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: novaSenha }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Erro", data.error || "Não foi possível atualizar a senha.");
        return;
      }

      Alert.alert("Sucesso!", "Sua senha foi atualizada. Faça login.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#AE0000" />

      <View style={styles.topBar} />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={26} color="#555" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Nova senha</Text>

        <Text style={styles.subtitle}>
          Escolha uma nova senha para a sua conta.
        </Text>

        {/* Campo Nova Senha */}
        <View
          style={[
            styles.inputContainer,
            novaSenha.length > 0 && !senhaValida && styles.inputErro,
          ]}
        >
          <Ionicons name="lock-closed-outline" size={20} color="#777" />
          <TextInput
            placeholder="Nova senha (mín. 6 caracteres)"
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry={!mostrarNova}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setMostrarNova(!mostrarNova)}>
            <Ionicons
              name={mostrarNova ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        {novaSenha.length > 0 && !senhaValida && (
          <Text style={styles.erro}>A senha deve ter pelo menos 6 caracteres</Text>
        )}

        {/* Campo Confirmar Senha */}
        <View
          style={[
            styles.inputContainer,
            confirmarSenha.length > 0 && !senhasIguais && styles.inputErro,
          ]}
        >
          <Ionicons name="lock-closed-outline" size={20} color="#777" />
          <TextInput
            placeholder="Confirmar nova senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry={!mostrarConfirmar}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => setMostrarConfirmar(!mostrarConfirmar)}
          >
            <Ionicons
              name={mostrarConfirmar ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        {confirmarSenha.length > 0 && !senhasIguais && (
          <Text style={styles.erro}>As senhas não coincidem</Text>
        )}

        {/* Botão Salvar */}
        <TouchableOpacity
          onPress={handleSalvar}
          disabled={!formValido || carregando}
          style={styles.buttonWrapper}
        >
          <LinearGradient
            colors={formValido ? ["#AE0000", "#8E5050"] : ["#ccc", "#aaa"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {carregando ? "Salvando..." : "Salvar senha"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF6EF",
    alignItems: "center",
    paddingTop: 150,
  },

  topBar: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 40,
    backgroundColor: "#AE0000",
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 15,
    zIndex: 10,
  },

  content: {
    width: "100%",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontFamily: "PoppinsBold",
    color: "#555",
    marginBottom: 15,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
    color: "#777",
    marginBottom: 30,
    width: "90%",
    textAlign: "center",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    width: "85%",
    padding: 12,
    borderRadius: 25,
    marginBottom: 5,
    elevation: 2,
  },

  input: {
    marginLeft: 10,
    flex: 1,
    fontFamily: "PoppinsSemiBold",
  },

  inputErro: {
    borderWidth: 1,
    borderColor: "red",
  },

  erro: {
    color: "red",
    fontSize: 12,
    fontFamily: "PoppinsSemiBold",
    alignSelf: "flex-start",
    marginLeft: "8%",
    marginBottom: 10,
  },

  buttonWrapper: {
    width: "85%",
    marginTop: 15,
  },

  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    elevation: 2,
  },

  buttonText: {
    color: "white",
    fontFamily: "PoppinsSemiBold",
    fontSize: 16,
  },
});