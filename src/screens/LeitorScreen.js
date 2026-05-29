import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Image, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';

const COLORS = {
  primary: '#AE0000',
  background: '#FAF6EF',
  white: '#FFFFFF',
  gray: '#999',
};

export default function LeitorScreen({ navigation, route }) {
  const { livro } = route.params;
  const [carregando, setCarregando] = useState(false);

  const abrirPDF = async () => {
    if (!livro.pdfAsset) {
      Alert.alert('Indisponível', 'Este livro não possui versão digital para leitura.');
      return;
    }

    setCarregando(true);
    try {
      // Carrega o asset do bundle
      const [asset] = await Asset.loadAsync(livro.pdfAsset);

      // Copia para o cache (necessário para abrir localmente)
      const destino = FileSystem.cacheDirectory + 'DomCasmurro.pdf';
      await FileSystem.copyAsync({ from: asset.localUri, to: destino });

      // Abre o PDF com o app de PDF nativo do dispositivo
      await Sharing.shareAsync(destino, {
        mimeType: 'application/pdf',
        UTI: 'com.adobe.pdf',
      });
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível abrir o livro. Tente novamente.');
      console.error(e);
    } finally {
      setCarregando(false);
    }
  };

  const capaSource = livro.coverUri ? { uri: livro.coverUri } : livro.image || null;

  const btnLabel = livro.progresso === 0
    ? 'Começar a ler'
    : livro.progresso === 100
    ? 'Reler'
    : 'Continuar lendo';

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#AE0000', '#8B0000']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{livro.title}</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <View style={styles.content}>
        {/* Capa */}
        <View style={styles.capaContainer}>
          {capaSource ? (
            <Image source={capaSource} style={styles.capaImagem} resizeMode="cover" />
          ) : (
            <LinearGradient colors={['#AE0000', '#6B0000']} style={styles.capaPlaceholder}>
              <Text style={styles.capaLetra}>
                {livro.title.split(' ').slice(0, 2).map(w => w[0]).join('')}
              </Text>
              <Text style={styles.capaTitulo}>{livro.title}</Text>
              <View style={styles.capaDivider} />
              <Text style={styles.capaAutor}>{livro.author}</Text>
            </LinearGradient>
          )}
        </View>

        {/* Infos */}
        <Text style={styles.titulo}>{livro.title}</Text>
        <Text style={styles.autor}>{livro.author}</Text>

        <View style={styles.infoBox}>
          <View style={styles.infoItem}>
            <Ionicons name="document-text-outline" size={16} color={COLORS.primary} />
            <Text style={styles.infoText}>{livro.paginas} páginas</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Ionicons name="phone-portrait-outline" size={16} color={COLORS.primary} />
            <Text style={styles.infoText}>{livro.formato}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Ionicons name="bookmark-outline" size={16} color={COLORS.primary} />
            <Text style={styles.infoText}>{livro.categoria}</Text>
          </View>
        </View>

        {/* Botão */}
        {livro.pdfAsset ? (
          <TouchableOpacity
            onPress={abrirPDF}
            style={styles.btnWrapper}
            disabled={carregando}
          >
            <LinearGradient
              colors={['#AE0000', '#8E5050']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.btn}
            >
              {carregando ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="book-outline" size={20} color="#fff" />
              )}
              <Text style={styles.btnText}>
                {carregando ? 'Carregando...' : btnLabel}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.indisponivelBox}>
            <Ionicons name="lock-closed-outline" size={28} color={COLORS.gray} />
            <Text style={styles.indisponivelText}>Leitura digital indisponível</Text>
            <Text style={styles.indisponivelSub}>Disponível apenas no formato físico.</Text>
          </View>
        )}

        {livro.pdfAsset && (
          <Text style={styles.nota}>📖 Obra de domínio público — distribuição gratuita e legal.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
  },
  headerTitle: {
    color: COLORS.white, fontFamily: 'PoppinsBold', fontSize: 16,
    flex: 1, textAlign: 'center', marginHorizontal: 8,
  },

  content: { flex: 1, alignItems: 'center', paddingHorizontal: 30, paddingTop: 32 },

  capaContainer: {
    elevation: 10, shadowColor: '#000', shadowOpacity: 0.3,
    shadowRadius: 10, shadowOffset: { width: 0, height: 5 },
    borderRadius: 14, marginBottom: 20,
  },
  capaImagem: { width: 150, height: 215, borderRadius: 14 },
  capaPlaceholder: {
    width: 150, height: 215, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', padding: 16,
  },
  capaLetra: { color: 'rgba(255,255,255,0.3)', fontSize: 36, fontFamily: 'PoppinsBold' },
  capaTitulo: { color: '#fff', fontFamily: 'PoppinsBold', fontSize: 14, textAlign: 'center', marginTop: 8 },
  capaDivider: { width: 40, height: 1.5, backgroundColor: 'rgba(255,255,255,0.4)', marginVertical: 10 },
  capaAutor: { color: 'rgba(255,255,255,0.8)', fontFamily: 'PoppinsSemiBold', fontSize: 11, textAlign: 'center' },

  titulo: { fontFamily: 'PoppinsBold', fontSize: 18, color: '#333', textAlign: 'center', marginBottom: 4 },
  autor: { fontFamily: 'PoppinsSemiBold', fontSize: 13, color: COLORS.gray, marginBottom: 20 },

  infoBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, borderRadius: 14,
    paddingHorizontal: 20, paddingVertical: 14,
    marginBottom: 28,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4,
  },
  infoItem: { flex: 1, alignItems: 'center', gap: 4 },
  infoText: { fontFamily: 'PoppinsSemiBold', fontSize: 11, color: '#555' },
  infoDivider: { width: 1, height: 30, backgroundColor: '#eee' },

  btnWrapper: { width: '100%', marginBottom: 16 },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16, borderRadius: 30, elevation: 4,
  },
  btnText: { color: COLORS.white, fontFamily: 'PoppinsBold', fontSize: 16 },

  indisponivelBox: { alignItems: 'center', marginTop: 10 },
  indisponivelText: { fontFamily: 'PoppinsBold', fontSize: 15, color: COLORS.gray, marginTop: 10 },
  indisponivelSub: { fontFamily: 'PoppinsSemiBold', fontSize: 12, color: '#bbb', textAlign: 'center', marginTop: 4 },

  nota: { fontFamily: 'PoppinsSemiBold', fontSize: 12, color: COLORS.gray, textAlign: 'center', lineHeight: 18 },
});