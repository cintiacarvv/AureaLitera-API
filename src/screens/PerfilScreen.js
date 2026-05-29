import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, Image, TouchableOpacity,
  ScrollView, TextInput, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.apiUrl;

const COLORS = {
  primary: '#AE0000',
  background: '#FAF6EF',
  white: '#FFFFFF',
  text: '#555',
  gray: '#999',
};

export default function PerfilScreen({ navigation, route }) {
  // Recebe o usuário logado da tela anterior
  const user = route?.params?.user || {};
  const isAdmin = user.isAdmin === true;

  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [telefone, setTelefone] = useState("");

  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  // Carrega dados completos do usuário (apenas usuários comuns, admin não tem registro no banco)
  useEffect(() => {
    if (!isAdmin && user.id) {
      setLoading(true);
      fetch(`${API_URL}/api/users/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.id) {
            setNome(data.name || "");
            setEmail(data.email || "");
            setTelefone(data.phone || "");
            setCep(data.cep || "");
            setRua(data.street || "");
            setNumero(data.number || "");
            setComplemento(data.complement || "");
            setBairro(data.neighborhood || "");
            setCidade(data.city || "");
            setEstado(data.state || "");
            if (data.avatar_url) setImage(data.avatar_url);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, []);

  const buscarCEP = async (cepDigitado) => {
    const cepLimpo = cepDigitado.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setRua(data.logradouro);
        setBairro(data.bairro);
        setCidade(data.localidade);
        setEstado(data.uf);
      }
    } catch (error) {}
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { alert("Permissão necessária"); return; }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleSalvar = async () => {
    if (isAdmin) { setIsEditing(false); return; }

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nome, email, phone: telefone,
          cep, street: rua, number: numero,
          complement: complemento, neighborhood: bairro,
          city: cidade, state: estado,
          avatar_url: image || null,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Perfil atualizado com sucesso!");
        setIsEditing(false);
      } else {
        alert(data.error || "Erro ao salvar");
      }
    } catch {
      alert("Erro de conexão.");
    } finally {
      setSaving(false);
    }
  };

  const handleExcluirConta = () => {
    Alert.alert(
      "Excluir conta",
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await fetch(`${API_URL}/api/users/${user.id}`, { method: 'DELETE' });
              navigation.navigate("Login");
            } catch {
              alert("Erro ao excluir conta.");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <TouchableOpacity onPress={isEditing ? handleSalvar : () => setIsEditing(true)} disabled={saving}>
            {saving
              ? <ActivityIndicator color={COLORS.primary} size="small" />
              : <Text style={styles.editBtn}>{isEditing ? "Salvar" : "Editar"}</Text>
            }
          </TouchableOpacity>
        </View>

        <View style={styles.photoContainer}>
          <View style={styles.photoWrapper}>
            {image ? (
              <Image source={{ uri: image }} style={styles.avatar} />
            ) : (
              <View style={styles.placeholderAvatar}>
                <Ionicons name="person" size={60} color={COLORS.gray} />
              </View>
            )}
            {isEditing && (
              <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          {isEditing ? (
            <TextInput value={nome} onChangeText={setNome} style={styles.input} />
          ) : (
            <Text style={styles.userName}>{nome}</Text>
          )}

          {isAdmin && (
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#fff" />
              <Text style={styles.adminBadgeText}>Administrador</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>
          <View style={styles.infoCard}>

            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>E-mail</Text>
                {isEditing && !isAdmin ? (
                  <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                ) : (
                  <Text style={styles.infoValue}>{email}</Text>
                )}
              </View>
            </View>

            {!isAdmin && (
              <View style={styles.infoItem}>
                <Ionicons name="call-outline" size={20} color={COLORS.primary} />
                <View style={styles.infoTextWrapper}>
                  <Text style={styles.infoLabel}>Telefone</Text>
                  {isEditing ? (
                    <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
                  ) : (
                    <Text style={styles.infoValue}>{telefone || "Não informado"}</Text>
                  )}
                </View>
              </View>
            )}

          </View>
        </View>

        {!isAdmin && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Endereço de Entrega</Text>
            <View style={styles.infoCard}>
              {isEditing ? (
                <>
                  <TextInput style={styles.input} placeholder="CEP" value={cep} onChangeText={(t) => { setCep(t); buscarCEP(t); }} keyboardType="numeric" />
                  <TextInput style={styles.input} placeholder="Rua" value={rua} onChangeText={setRua} />
                  <TextInput style={styles.input} placeholder="Número" value={numero} onChangeText={setNumero} />
                  <TextInput style={styles.input} placeholder="Complemento" value={complemento} onChangeText={setComplemento} />
                  <TextInput style={styles.input} placeholder="Bairro" value={bairro} onChangeText={setBairro} />
                  <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} />
                  <TextInput style={styles.input} placeholder="Estado (UF)" value={estado} onChangeText={setEstado} maxLength={2} autoCapitalize="characters" />
                </>
              ) : (
                <View style={styles.infoItem}>
                  <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoLabel}>Endereço</Text>
                    <Text style={styles.infoValue}>
                      {rua && numero ? `${rua}, ${numero}` : "Não informado"}
                    </Text>
                    {bairro && cidade && estado ? (
                      <Text style={styles.infoValue}>{bairro} - {cidade}/{estado}</Text>
                    ) : null}
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {!isAdmin && (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("MeusPedidos", { user })}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="list-outline" size={24} color={COLORS.primary} />
              <Text style={styles.menuItemText}>Meus Pedidos</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
          </TouchableOpacity>
        )}

        {/* Botão Admin: visível APENAS para admin@email.com */}
        {isAdmin && (
          <TouchableOpacity
            style={styles.adminBtn}
            onPress={() => navigation.navigate("AdminLivros", { user })}
          >
            <Ionicons name="settings-outline" size={18} color={COLORS.primary} />
            <Text style={styles.adminText}>Área Admin — Gerenciar Livros</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

        {/* Excluir conta: apenas usuários comuns */}
        {!isAdmin && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleExcluirConta}>
            <Text style={styles.deleteText}>Excluir minha conta</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6EF' },
  scrollContent: { paddingBottom: 40 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    padding: 20, alignItems: 'center',
  },
  headerTitle: { fontFamily: 'PoppinsBold', fontSize: 20, color: '#AE0000' },
  editBtn: { color: '#AE0000', fontFamily: 'PoppinsSemiBold' },
  photoContainer: { alignItems: 'center', marginBottom: 15 },
  photoWrapper: { position: 'relative' },
  avatar: { width: 115, height: 115, borderRadius: 60, borderWidth: 3, borderColor: '#AE0000' },
  placeholderAvatar: {
    width: 115, height: 115, borderRadius: 60,
    backgroundColor: '#F1EAE0', justifyContent: 'center', alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute', bottom: 5, right: 5,
    backgroundColor: '#AE0000', padding: 8, borderRadius: 20,
  },
  userName: { fontFamily: 'PoppinsBold', fontSize: 22, marginTop: 10, color: '#333' },
  adminBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#AE0000',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 6, gap: 4,
  },
  adminBadgeText: { color: '#fff', fontFamily: 'PoppinsSemiBold', fontSize: 12 },
  section: { marginTop: 20, paddingHorizontal: 20 },
  sectionTitle: { fontFamily: 'PoppinsBold', fontSize: 15, color: '#AE0000', marginBottom: 10 },
  infoCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 16 },
  infoItem: { flexDirection: 'row', marginBottom: 15 },
  infoTextWrapper: { marginLeft: 12, flex: 1 },
  infoLabel: { fontSize: 12, color: '#8B6F47', fontFamily: 'PoppinsSemiBold' },
  infoValue: { fontSize: 14, color: '#333', fontFamily: 'PoppinsSemiBold' },
  input: {
    backgroundColor: '#FAF6EF', borderRadius: 12,
    padding: 10, marginTop: 5, fontFamily: 'PoppinsSemiBold',
  },
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#FFF', margin: 20, padding: 18, borderRadius: 18,
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuItemText: { marginLeft: 12, fontFamily: 'PoppinsBold' },
  adminBtn: {
    flexDirection: "row", justifyContent: "center",
    alignItems: "center", marginTop: 10, marginHorizontal: 20,
    backgroundColor: '#FFF', padding: 16, borderRadius: 18,
    borderWidth: 1, borderColor: '#AE0000',
  },
  adminText: {
    marginLeft: 8, fontSize: 14, color: "#AE0000",
    fontFamily: "PoppinsSemiBold",
  },
  logoutBtn: { alignItems: 'center', marginTop: 24 },
  logoutText: { color: '#AE0000', fontFamily: 'PoppinsBold' },
  deleteBtn: { alignItems: 'center', marginTop: 16 },
  deleteText: { color: '#aaa', fontFamily: 'PoppinsSemiBold', fontSize: 12 },
});