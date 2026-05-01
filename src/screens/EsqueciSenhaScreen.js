import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from 'expo-status-bar';

export default function EsqueciSenhaScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [erroEmail, setErroEmail] = useState("");


  const emailValido = email.includes("@") && email.length > 5;
  const formValido = emailValido;

  function handleEnviar() {
    if (!emailValido) {
      setErroEmail("Digite um email válido");
      return;
    }

    setErroEmail("");

    alert("Instruções enviadas para seu email!");
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      
      <StatusBar style="light" backgroundColor="#AE0000" />

      <View style={styles.topBar} />


      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={26} color="#555" />
      </TouchableOpacity>


      <View style={styles.content}>
        
        <Text style={styles.title}>Esqueceu sua senha?</Text>

        <Text style={styles.subtitle}>
          Não se preocupe! Digite seu e-mail e enviaremos instruções para redefinir sua senha.
        </Text>


        <View style={[
          styles.inputContainer,
          erroEmail !== "" && styles.inputErro
        ]}>
          <Ionicons name="mail-outline" size={20} color="#777" />
          <TextInput
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>


        {erroEmail !== "" && (
          <Text style={styles.erro}>{erroEmail}</Text>
        )}


        <TouchableOpacity
          onPress={handleEnviar}
          disabled={!formValido}
          style={styles.buttonWrapper}
        >
          <LinearGradient
            colors={formValido ? ["#AE0000", "#8E5050"] : ["#ccc", "#aaa"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Enviar</Text>
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
    marginTop: 10,
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