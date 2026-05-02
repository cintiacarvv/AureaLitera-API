import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from 'expo-status-bar';
import { authService } from "../services/authService";

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erroNome, setErroNome] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroConfirmar, setErroConfirmar] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const senhaRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
  const emailValido = email.includes("@") && email.length > 5;
  const senhaValida = senhaRegex.test(senha);
  const senhasIguais = senha === confirmarSenha && confirmarSenha !== "";
  const formValido = nome.length > 0 && emailValido && senhaValida && senhasIguais;

  async function handleCadastro() {
    let erro = false;
    if (!nome) { setErroNome("Digite seu nome"); erro = true; } else setErroNome("");
    if (!emailValido) { setErroEmail("Digite um email válido"); erro = true; } else setErroEmail("");
    if (!senhaValida) { setErroSenha("Senha: 6 dígitos (um caractére especial, uma maiúscula e um número)"); erro = true; } else setErroSenha("");
    if (!senhasIguais) { setErroConfirmar("As senhas não coincidem"); erro = true; } else setErroConfirmar("");

    if (erro) return;

    try {
      await authService.cadastrar(nome, email, senha);
      Alert.alert("Sucesso", "Conta criada com sucesso!", [{ text: "OK", onPress: () => navigation.navigate("Login") }]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível realizar o cadastro.");
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
          <TextInput placeholder="Digite o seu nome" value={nome} onChangeText={setNome} style={styles.input} />
        </View>
        {erroNome !== "" && <Text style={styles.erro}>{erroNome}</Text>}

        <View style={[styles.inputContainer, erroEmail && styles.inputErro]}>
          <Ionicons name="mail-outline" size={20} color="#777" />
          <TextInput placeholder="Digite seu email" value={email} onChangeText={setEmail} style={styles.input} />
        </View>
        {erroEmail !== "" && <Text style={styles.erro}>{erroEmail}</Text>}

        <View style={[styles.inputContainer, erroSenha && styles.inputErro]}>
          <Ionicons name="lock-closed-outline" size={20} color="#777" />
          <TextInput placeholder="Digite uma senha" secureTextEntry={!mostrarSenha} value={senha} onChangeText={setSenha} style={styles.input} />
          <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
            <Ionicons name={mostrarSenha ? "eye-off-outline" : "eye-outline"} size={20} color="#777" />
          </TouchableOpacity>
        </View>
        {erroSenha !== "" && <Text style={styles.erro}>{erroSenha}</Text>}

        <View style={[styles.inputContainer, erroConfirmar && styles.inputErro]}>
          <Ionicons name="lock-closed-outline" size={20} color="#777" />
          <TextInput placeholder="Confirme a senha" secureTextEntry={!mostrarConfirmar} value={confirmarSenha} onChangeText={setConfirmarSenha} style={styles.input} />
          <TouchableOpacity onPress={() => setMostrarConfirmar(!mostrarConfirmar)}>
            <Ionicons name={mostrarConfirmar ? "eye-off-outline" : "eye-outline"} size={20} color="#777" />
          </TouchableOpacity>
        </View>
        {erroConfirmar !== "" && <Text style={styles.erro}>{erroConfirmar}</Text>}

        <Text style={styles.infoSenha}>Senha deve conter 6 dígitos (um caractére especial, uma maiúscula e um número)</Text>

        <TouchableOpacity onPress={handleCadastro} disabled={!formValido} style={styles.buttonWrapper}>
          <LinearGradient colors={formValido ? ["#AE0000", "#8E5050"] : ["#ccc", "#aaa"]} style={styles.button}>
            <Text style={styles.buttonText}>Criar conta</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF6EF", alignItems: "center", paddingTop: 100 },
  topBar: { position: "absolute", top: 0, width: "100%", height: 40, backgroundColor: "#AE0000" },
  backButton: { position: "absolute", top: 50, left: 15 },
  content: { width: "100%", alignItems: "center" },
  title: { fontSize: 32, fontWeight: "bold", color: "#555", marginBottom: 10 },
  subtitle: { fontSize: 14, color: "#777", marginBottom: 30 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#eee", width: "85%", padding: 12, borderRadius: 25, marginBottom: 10 },
  input: { marginLeft: 10, flex: 1 },
  inputErro: { borderWidth: 1, borderColor: "red" },
  erro: { color: "red", fontSize: 12, alignSelf: "flex-start", marginLeft: "10%", marginBottom: 10 },
  infoSenha: { fontSize: 12, color: "#777", marginBottom: 20, textAlign: "center" },
  buttonWrapper: { width: "85%" },
  button: { width: "100%", paddingVertical: 15, borderRadius: 25, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 }
});