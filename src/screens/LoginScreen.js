import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from 'expo-status-bar';
import { Image } from "react-native";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.apiUrl;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

  const formValido = emailRegex.test(email) && senhaRegex.test(senha);

  async function handleLogin() {
    let erro = false;

    if (!emailRegex.test(email)) {
      setErroEmail("Digite um email válido");
      erro = true;
    } else {
      setErroEmail("");
    }

    if (!senhaRegex.test(senha)) {
      setErroSenha("Senha deve ter 6+ caracteres, 1 maiúscula, 1 número e 1 símbolo");
      erro = true;
    } else {
      setErroSenha("");
    }

    if (erro) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErroSenha(data.error || "Email ou senha incorretos");
        return;
      }

      // Navega passando os dados do usuário para a Home
      navigation.navigate("Home", {
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
          isAdmin: data.isAdmin,
        }
      });

    } catch (err) {
      setErroSenha("Erro de conexão. Verifique o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#AE0000" />
      <View style={styles.topBar} />

      <View style={styles.iconContainer}>
        <Image
          source={require("../../assets/logoo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Acessar conta</Text>
      <Text style={styles.subtitle}>Acesse sua conta da ÁureaLítera</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#777" />
        <TextInput
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      {erroEmail !== "" && <Text style={styles.erro}>{erroEmail}</Text>}

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#777" />
        <TextInput
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={styles.input}
        />
      </View>
      {erroSenha !== "" && <Text style={styles.erro}>{erroSenha}</Text>}

      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("EsqueciSenha")}>
          <Text style={styles.link}>Esqueci minha senha</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
          <Text style={styles.link}>Não tenho conta</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={!formValido || loading}
        style={styles.buttonWrapper}
      >
        <LinearGradient
          colors={formValido && !loading ? ["#AE0000", "#8E5050"] : ["#ccc", "#aaa"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Entrar</Text>
          }
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF6EF",
    alignItems: "center",
    paddingTop: 80,
  },
  topBar: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 40,
    backgroundColor: "#AE0000",
  },
  logo: {
    width: 190,
    height: 120,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 35,
    fontFamily: "PoppinsBold",
    color: "#555",
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 14,
    color: "#777",
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    width: "85%",
    padding: 12,
    borderRadius: 25,
    marginBottom: 15,
    elevation: 2,
  },
  input: {
    fontFamily: "PoppinsSemiBold",
    marginLeft: 10,
    flex: 1,
  },
  erro: {
    color: "red",
    fontSize: 12,
    fontFamily: "PoppinsSemiBold",
    alignSelf: "flex-start",
    marginLeft: "8%",
    marginBottom: 10,
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginBottom: 20,
  },
  link: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 12,
    color: "#777",
  },
  button: {
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    elevation: 5,
  },
  buttonWrapper: {
    width: "85%",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontFamily: "PoppinsSemiBold",
    fontSize: 16,
  },
});