import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

const COLORS = {
  primary: '#AE0000',
  background: '#FAF6EF',
  white: '#FFFFFF',
  text: '#555',
  gray: '#999',
};

export default function PerfilScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [nome, setNome] = useState("Cintia Oliveira");
  const [email, setEmail] = useState("cintia.oliver@email.com");
  const [telefone, setTelefone] = useState("(11) 98888-7777");

  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

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

    if (!permission.granted) {
      alert("Permissão necessária");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Meu Perfil</Text>

          <TouchableOpacity onPress={handleEdit}>
            <Text style={styles.editBtn}>
              {isEditing ? "Salvar" : "Editar"}
            </Text>
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

            <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <TextInput value={nome} onChangeText={setNome} style={styles.input} />
          ) : (
            <Text style={styles.userName}>{nome}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>

          <View style={styles.infoCard}>

            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>E-mail</Text>
                {isEditing ? (
                  <TextInput style={styles.input} value={email} onChangeText={setEmail} />
                ) : (
                  <Text style={styles.infoValue}>{email}</Text>
                )}
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={20} color={COLORS.primary} />
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>Telefone</Text>
                {isEditing ? (
                  <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} />
                ) : (
                  <Text style={styles.infoValue}>{telefone}</Text>
                )}
              </View>
            </View>

          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço de Entrega</Text>

          <View style={styles.infoCard}>

            {isEditing ? (
              <>
                <TextInput style={styles.input} placeholder="CEP" value={cep} onChangeText={(t) => { setCep(t); buscarCEP(t); }} />
                <TextInput style={styles.input} placeholder="Rua" value={rua} onChangeText={setRua} />
                <TextInput style={styles.input} placeholder="Número" value={numero} onChangeText={setNumero} />
                <TextInput style={styles.input} placeholder="Complemento" value={complemento} onChangeText={setComplemento} />
                <TextInput style={styles.input} placeholder="Bairro" value={bairro} onChangeText={setBairro} />
                <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} />
                <TextInput style={styles.input} placeholder="Estado" value={estado} onChangeText={setEstado} maxLength={2} />
              </>
            ) : (
              <>
                <View style={styles.infoItem}>
                  <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoLabel}>Endereço</Text>
                    <Text style={styles.infoValue}>
                      {rua && numero ? `${rua}, ${numero}` : "Não informado"}
                    </Text>
                    <Text style={styles.infoValue}>
                      {bairro && cidade && estado ? `${bairro} - ${cidade}/${estado}` : ""}
                    </Text>
                  </View>
                </View>
              </>
            )}

          </View>
        </View>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("MeusPedidos")}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="list-outline" size={24} color={COLORS.primary} />
            <Text style={styles.menuItemText}>Meus Pedidos</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.adminBtn}
          onPress={() => navigation.navigate("AdminLivros")}
        >
          <Ionicons name="settings-outline" size={18} color={COLORS.primary} />
          <Text style={styles.adminText}>Área Admin</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF6EF' },
  scrollContent: { paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },

  headerTitle: {
    fontFamily: 'PoppinsBold',
    fontSize: 20,
    color: '#AE0000',
  },

  editBtn: {
    color: '#AE0000',
    fontFamily: 'PoppinsSemiBold',
  },

  photoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },

  photoWrapper: {
    position: 'relative',
  },

  avatar: {
    width: 115,
    height: 115,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#AE0000',
  },

  placeholderAvatar: {
    width: 115,
    height: 115,
    borderRadius: 60,
    backgroundColor: '#F1EAE0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#AE0000',
    padding: 8,
    borderRadius: 20,
  },

  userName: {
    fontFamily: 'PoppinsBold',
    fontSize: 22,
    marginTop: 10,
    color: '#333',
  },

  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontFamily: 'PoppinsBold',
    fontSize: 15,
    color: '#AE0000',
    marginBottom: 10,
  },

  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
  },

  infoItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  infoTextWrapper: {
    marginLeft: 12,
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: '#8B6F47',
    fontFamily: 'PoppinsSemiBold',
  },

  infoValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'PoppinsSemiBold',
  },

  input: {
    backgroundColor: '#FAF6EF',
    borderRadius: 12,
    padding: 10,
    marginTop: 5,
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    margin: 20,
    padding: 18,
    borderRadius: 18,
  },

  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuItemText: {
    marginLeft: 12,
    fontFamily: 'PoppinsBold',
  },

  adminBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    opacity: 0.6
  },

  adminText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#AE0000",
    fontFamily: "PoppinsSemiBold"
  },

  logoutBtn: {
    alignItems: 'center',
    marginTop: 20,
  },

  logoutText: {
    color: '#AE0000',
    fontFamily: 'PoppinsBold',
  },
});