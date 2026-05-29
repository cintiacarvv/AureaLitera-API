import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.apiUrl;

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);

  const [erroNome, setErroNome] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroConfirmar, setErroConfirmar] = useState("");

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
  const senhaValida = senhaRegex.test(senha);
  const senhasIguais = senha === confirmarSenha && confirmarSenha !== "";

  const formValido = nome.length > 0 && emailValido && senhaValida && senhasIguais;

  async function handleCadastro() {
    let erro = false;

    if (!nome) { setErroNome("Digite seu nome"); erro = true; } else setErroNome("");
    if (!emailValido) { setErroEmail("Digite um email válido"); erro = true; } else setErroEmail("");
    if (!senhaValida) { setErroSenha("Senha: 6+ caracteres, 1 maiúscula, 1 número e 1 símbolo"); erro = true; } else setErroSenha("");
    if (!senhasIguais) { setErroConfirmar("As senhas não coincidem"); erro = true; } else setErroConfirmar("");

    if (erro) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nome, email, password: senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes('já está cadastrado')) {
          setErroEmail(data.error);
        } else if (data.error?.includes('não pode ser usado')) {
          setErroEmail(data.error);
        } else {
          setErroSenha(data.error || "Erro ao criar conta");
        }
        return;
      }

      alert("Conta criada com sucesso! Faça o login para continuar.");
      navigation.navigate("Login");

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

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={26} color="#555" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Cadastro</Text>
        <Text style={styles.subtitle}>Faça parte da comunidade de leitores</Text>

        <View style={[styles.inputContainer, erroNome && styles.inputErro]}>
          <Ionicons name="person-outline" size={20} color="#777" />
          <TextInput
            placeholder="Digite o seu nome"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />
        </View>
        {erroNome !== "" && <Text style={styles.erro}>{erroNome}</Text>}

        <View style={[styles.inputContainer, erroEmail && styles.inputErro]}>
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

        <View style={[styles.inputContainer, erroSenha && styles.inputErro]}>
          <Ionicons name="lock-closed-outline" size={20} color="#777" />
          <TextInput
            placeholder="Digite uma senha"
            secureTextEntry={!mostrarSenha}
            value={senha}
            onChangeText={setSenha}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
            <Ionicons name={mostrarSenha ? "eye-off-outline" : "eye-outline"} size={20} color="#777" />
          </TouchableOpacity>
        </View>
        {erroSenha !== "" && <Text style={styles.erro}>{erroSenha}</Text>}

        <View style={[styles.inputContainer, erroConfirmar && styles.inputErro]}>
          <Ionicons name="lock-closed-outline" size={20} color="#777" />
          <TextInput
            placeholder="Confirme a senha"
            secureTextEntry={!mostrarConfirmar}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setMostrarConfirmar(!mostrarConfirmar)}>
            <Ionicons name={mostrarConfirmar ? "eye-off-outline" : "eye-outline"} size={20} color="#777" />
          </TouchableOpacity>
        </View>
        {erroConfirmar !== "" && <Text style={styles.erro}>{erroConfirmar}</Text>}

        <Text style={styles.infoSenha}>
          A senha deve ter no mínimo 6 caracteres, com letra maiúscula, número e símbolo.
        </Text>

        <TouchableOpacity
          onPress={handleCadastro}
          disabled={!formValido || loading}
          style={styles.buttonWrapper}
        >
          <LinearGradient
            colors={formValido && !loading ? ["#AE0000", "#8E5050"] : ["#ccc", "#aaa"]}
            style={styles.button}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Criar conta</Text>
            }
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
    paddingTop: 80,
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
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontFamily: "PoppinsBold",
    color: "#555",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 30,
    fontFamily: "PoppinsSemiBold",
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
    alignSelf: "flex-start",
    marginLeft: "8%",
    marginBottom: 10,
    fontFamily: "PoppinsSemiBold",
  },
  infoSenha: {
    fontSize: 12,
    color: "#777",
    marginBottom: 20,
    width: "80%",
    textAlign: "center",
    fontFamily: "PoppinsSemiBold",
  },
  buttonWrapper: {
    width: "85%",
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
    fontFamily: "PoppinsBold",
    fontSize: 16,
  },
});