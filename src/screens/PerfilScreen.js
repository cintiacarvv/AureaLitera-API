import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = { primary: "#AE0000", background: "#FAF6EF", white: "#FFFFFF", text: "#555", gray: "#999" };

export default function PerfilScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState("USER");

  // Dados do usuário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const userData = await AsyncStorage.getItem('@AureaLitera:usuario_logado');
    if (userData) {
      const user = JSON.parse(userData);
      setNome(user.nome || "");
      setEmail(user.email || "");
      setTelefone(user.telefone || "");
      setRole(user.role || "USER");
      setCep(user.cep || "");
      setRua(user.rua || "");
      setNumero(user.numero || "");
      setComplemento(user.complemento || "");
      setBairro(user.bairro || "");
      setCidade(user.cidade || "");
      setEstado(user.estado || "");
      if(user.image) setImage(user.image);
    }
  };

  const buscarCEP = async (val) => {
    const cleanCep = val.replace(/\D/g, "");
    setCep(cleanCep);
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setRua(data.logradouro);
          setBairro(data.bairro);
          setCidade(data.localidade);
          setEstado(data.uf);
        }
      } catch (e) { console.log(e) }
    }
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      const userAtualizado = { nome, email, telefone, role, cep, rua, numero, complemento, bairro, cidade, estado, image };
      await AsyncStorage.setItem('@AureaLitera:usuario_logado', JSON.stringify(userAtualizado));
      
      const storageValue = await AsyncStorage.getItem('@AureaLitera:todos_usuarios');
      let usuarios = storageValue ? JSON.parse(storageValue) : [];
      usuarios = usuarios.map(u => u.email === email ? { ...u, ...userAtualizado } : u);
      await AsyncStorage.setItem('@AureaLitera:todos_usuarios', JSON.stringify(usuarios));
      
      Alert.alert("Sucesso", "Perfil atualizado!");
    }
    setIsEditing(!isEditing);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@AureaLitera:usuario_logado');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return Alert.alert("Aviso", "Permissão necessária");
    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <TouchableOpacity onPress={handleEditToggle}>
            <Text style={styles.editBtn}>{isEditing ? "Salvar" : "Editar"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.photoContainer}>
          <View style={styles.photoWrapper}>
            {image ? <Image source={{ uri: image }} style={styles.avatar} /> : 
              <View style={styles.placeholderAvatar}><Ionicons name="person" size={60} color={COLORS.gray} /></View>}
            <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}><Ionicons name="camera" size={20} color="#fff" /></TouchableOpacity>
          </View>
          {isEditing ? <TextInput value={nome} onChangeText={setNome} style={[styles.input, {textAlign: 'center', width: '60%'}]} /> : 
            <Text style={styles.userName}>{nome}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>
          <View style={styles.infoCard}>
            <InfoRow icon="mail-outline" label="E-mail" value={email} isEditing={isEditing} onChange={setEmail} editable={false} />
            <InfoRow icon="call-outline" label="Telefone" value={telefone} isEditing={isEditing} onChange={setTelefone} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          <View style={styles.infoCard}>
            {isEditing ? (
              <>
                <TextInput style={styles.input} placeholder="CEP" value={cep} onChangeText={buscarCEP} keyboardType="numeric" />
                <TextInput style={styles.input} placeholder="Rua" value={rua} onChangeText={setRua} />
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <TextInput style={[styles.input, {width: '45%'}]} placeholder="Nº" value={numero} onChangeText={setNumero} />
                  <TextInput style={[styles.input, {width: '45%'}]} placeholder="Compl." value={complemento} onChangeText={setComplemento} />
                </View>
                <TextInput style={styles.input} placeholder="Bairro" value={bairro} onChangeText={setBairro} />
                <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} />
              </>
            ) : (
              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                <View style={styles.infoTextWrapper}>
                  <Text style={styles.infoLabel}>Endereço Completo</Text>
                  <Text style={styles.infoValue}>{rua ? `${rua}, ${numero} - ${bairro}` : "Não informado"}</Text>
                  <Text style={styles.infoValue}>{cidade ? `${cidade}/${estado}` : ""}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("MeusPedidos")}>
          <View style={styles.menuItemLeft}><Ionicons name="list-outline" size={24} color={COLORS.primary} /><Text style={styles.menuItemText}>Meus Pedidos</Text></View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
        </TouchableOpacity>

        {role === 'ADMIN' && (
          <TouchableOpacity style={styles.adminBtn} onPress={() => navigation.navigate("AdminLivros")}>
            <Ionicons name="settings-outline" size={18} color={COLORS.primary} /><Text style={styles.adminText}>Área Admin</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Componente auxiliar para as linhas de informação
const InfoRow = ({ icon, label, value, isEditing, onChange, editable = true }) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon} size={20} color={COLORS.primary} />
    <View style={styles.infoTextWrapper}>
      <Text style={styles.infoLabel}>{label}</Text>
      {isEditing && editable ? <TextInput style={styles.input} value={value} onChangeText={onChange} /> : <Text style={styles.infoValue}>{value || "---"}</Text>}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF6EF" },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 20, alignItems: "center" },
  headerTitle: { fontSize: 20, color: "#AE0000", fontWeight: "bold" },
  editBtn: { color: "#AE0000", fontWeight: "600" },
  photoContainer: { alignItems: "center", marginBottom: 15 },
  photoWrapper: { position: "relative" },
  avatar: { width: 115, height: 115, borderRadius: 60, borderWidth: 3, borderColor: "#AE0000" },
  placeholderAvatar: { width: 115, height: 115, borderRadius: 60, backgroundColor: "#F1EAE0", justifyContent: "center", alignItems: "center" },
  cameraIcon: { position: "absolute", bottom: 5, right: 5, backgroundColor: "#AE0000", padding: 8, borderRadius: 20 },
  userName: { fontSize: 22, marginTop: 10, color: "#333", fontWeight: "bold" },
  section: { marginTop: 20, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 15, color: "#AE0000", marginBottom: 10, fontWeight: "bold" },
  infoCard: { backgroundColor: "#FFF", borderRadius: 18, padding: 16 },
  infoItem: { flexDirection: "row", marginBottom: 15 },
  infoTextWrapper: { marginLeft: 12, flex: 1 },
  infoLabel: { fontSize: 12, color: "#8B6F47", fontWeight: "600" },
  infoValue: { fontSize: 14, color: "#333", fontWeight: "600" },
  input: { backgroundColor: "#FAF6EF", borderRadius: 12, padding: 8, marginTop: 5 },
  menuItem: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#FFF", margin: 20, padding: 18, borderRadius: 18 },
  menuItemLeft: { flexDirection: "row", alignItems: "center" },
  menuItemText: { marginLeft: 12, fontWeight: "bold" },
  adminBtn: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 10, opacity: 0.7 },
  adminText: { marginLeft: 6, fontSize: 12, color: "#AE0000", fontWeight: "600" },
  logoutBtn: { alignItems: "center", marginTop: 25 },
  logoutText: { color: "#AE0000", fontWeight: "bold" },
});