import React, { useState } from 'react';
import {
  StyleSheet, Text, View, FlatList, Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

import book8 from '../../assets/book8.png';
import book2 from '../../assets/book2.jpg';
import book3 from '../../assets/book3.jpg';

const COLORS = {
  primary: '#AE0000',
  background: '#FAF6EF',
  white: '#FFFFFF',
  gray: '#999',
  lightGray: '#eee',
  green: '#4CAF50',
  blue: '#1565C0',
};

// Ciclo de status: não iniciado → lendo → concluído → não iniciado
const STATUS_CYCLE = ['nao_iniciado', 'lendo', 'concluido'];

const STATUS_CONFIG = {
  nao_iniciado: {
    label: 'Não iniciado',
    icon: '○',
    color: COLORS.gray,
    nextLabel: 'Marcar como Lendo',
    btnIcon: 'play-outline',
    btnLabel: 'Começar a ler',
    btnColors: ['#AE0000', '#8E5050'],
  },
  lendo: {
    label: 'Lendo',
    icon: '📖',
    color: COLORS.primary,
    nextLabel: 'Marcar como Concluído',
    btnIcon: 'book-outline',
    btnLabel: 'Continuar lendo',
    btnColors: ['#AE0000', '#8E5050'],
  },
  concluido: {
    label: 'Concluído',
    icon: '✓',
    color: COLORS.green,
    nextLabel: 'Reiniciar leitura',
    btnIcon: 'refresh-outline',
    btnLabel: 'Reler',
    btnColors: ['#4CAF50', '#388E3C'],
  },
};

// Deriva status inicial a partir do progresso existente
function statusFromProgresso(progresso) {
  if (progresso === 100) return 'concluido';
  if (progresso > 0) return 'lendo';
  return 'nao_iniciado';
}

const LIVROS_BASE = [
  {
    id: 'domcasmurro',
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    coverUri: null,
    image: book8,
    progresso: 0,
    paginas: 199,
    formato: 'eBook',
    categoria: 'Romance',
    pdfAsset: require('../../assets/books/DomCasmurro.pdf'),
  },
  {
    id: '2',
    title: 'A Bailarina de Auschwitz',
    author: 'Edith Eva Eger',
    coverUri: null,
    image: book3,
    progresso: 65,
    paginas: 304,
    formato: 'eBook',
    categoria: 'Autoajuda',
    pdfAsset: null,
  },
  {
    id: '3',
    title: 'A Sutil Arte de Ligar o F*da-se',
    author: 'Mark Manson',
    coverUri: null,
    image: book2,
    progresso: 100,
    paginas: 256,
    formato: 'eBook',
    categoria: 'Autoajuda',
    pdfAsset: null,
  },
];

export default function MeusLivrosScreen({ navigation }) {
  const [filtro, setFiltro] = useState('Todos');

  // Estado de status de cada livro, inicializado pelo progresso
  const [statusMap, setStatusMap] = useState(() => {
    const map = {};
    LIVROS_BASE.forEach((l) => {
      map[l.id] = statusFromProgresso(l.progresso);
    });
    return map;
  });

  const avancarStatus = (id) => {
    setStatusMap((prev) => {
      const atual = prev[id];
      const idx = STATUS_CYCLE.indexOf(atual);
      const proximo = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
      return { ...prev, [id]: proximo };
    });
  };

  const livrosFiltrados = LIVROS_BASE.filter((livro) => {
    const s = statusMap[livro.id];
    if (filtro === 'Lendo') return s === 'lendo';
    if (filtro === 'Concluídos') return s === 'concluido';
    return true;
  });

  const emLeitura = LIVROS_BASE.filter((l) => statusMap[l.id] === 'lendo');
  const concluidos = LIVROS_BASE.filter((l) => statusMap[l.id] === 'concluido');

  const renderLivro = ({ item }) => {
    const statusKey = statusMap[item.id];
    const cfg = STATUS_CONFIG[statusKey];
    const capaSource = item.coverUri ? { uri: item.coverUri } : item.image || null;
    const paginasLidas = Math.round((item.progresso / 100) * item.paginas);

    return (
      <View style={styles.card}>
        <View style={styles.capaWrapper}>
          {capaSource ? (
            <Image source={capaSource} style={styles.bookImage} resizeMode="cover" />
          ) : (
            <LinearGradient colors={['#AE0000', '#6B0000']} style={styles.bookImagePlaceholder}>
              <Text style={styles.capaLetra}>
                {item.title.split(' ').slice(0, 2).map((w) => w[0]).join('')}
              </Text>
              <Text style={styles.capaTitulo} numberOfLines={3}>{item.title}</Text>
              <Text style={styles.capaAutor}>{item.author}</Text>
            </LinearGradient>
          )}
          <View style={styles.formatoBadge}>
            <Text style={styles.formatoText}>{item.formato}</Text>
          </View>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.bookAuthor}>{item.author}</Text>

          {/* ── Botão de status cíclico ── */}
          <TouchableOpacity
            style={[styles.statusCycleBtn, { borderColor: cfg.color, backgroundColor: cfg.color + '15' }]}
            onPress={() => avancarStatus(item.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.statusCycleIcon, { color: cfg.color }]}>{cfg.icon}</Text>
            <Text style={[styles.statusCycleLabel, { color: cfg.color }]}>{cfg.label}</Text>
            <Ionicons name="chevron-forward-outline" size={13} color={cfg.color} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

          <View style={styles.categoriaRow}>
            <Text style={styles.categoriaText}>{item.categoria}</Text>
            {statusKey === 'lendo' && item.progresso > 0 && (
              <Text style={styles.progressoTexto}>{item.progresso}% · {paginasLidas}/{item.paginas} pág.</Text>
            )}
          </View>

          {/* Barra de progresso apenas quando lendo e tem progresso */}
          {statusKey === 'lendo' && item.progresso > 0 && (
            <View style={styles.progressoBar}>
              <View style={[styles.progressoFill, { width: `${item.progresso}%`, backgroundColor: cfg.color }]} />
            </View>
          )}

          {/* Botão de ação (abrir leitor) */}
          <TouchableOpacity
            style={styles.lerBtn}
            onPress={() => navigation.navigate('Leitor', { livro: item })}
          >
            <LinearGradient
              colors={cfg.btnColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.lerBtnGradient}
            >
              <Ionicons name={cfg.btnIcon} size={14} color="#fff" />
              <Text style={styles.lerBtnText}>{cfg.btnLabel}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />

      <LinearGradient colors={['#AE0000', '#8B0000']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Minha Estante</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <View style={styles.resumoRow}>
        <View style={styles.resumoCard}>
          <Ionicons name="library-outline" size={20} color={COLORS.primary} />
          <Text style={styles.resumoNumero}>{LIVROS_BASE.length}</Text>
          <Text style={styles.resumoLabel}>Total</Text>
        </View>
        <View style={[styles.resumoCard, styles.resumoCardDestaque]}>
          <Ionicons name="book-outline" size={20} color={COLORS.white} />
          <Text style={[styles.resumoNumero, { color: COLORS.white }]}>{emLeitura.length}</Text>
          <Text style={[styles.resumoLabel, { color: COLORS.white }]}>Lendo</Text>
        </View>
        <View style={styles.resumoCard}>
          <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.green} />
          <Text style={[styles.resumoNumero, { color: COLORS.green }]}>{concluidos.length}</Text>
          <Text style={styles.resumoLabel}>Concluídos</Text>
        </View>
      </View>

      <View style={styles.filtrosContainer}>
        {['Todos', 'Lendo', 'Concluídos'].map((label) => (
          <TouchableOpacity
            key={label}
            style={[styles.filtroBtn, filtro === label && styles.filtroBtnAtivo]}
            onPress={() => setFiltro(label)}
          >
            <Text style={[styles.filtroText, filtro === label && styles.filtroTextAtivo]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={livrosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderLivro}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={70} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum livro aqui ainda</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.emptyBtnText}>Explorar livros</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
  },
  headerTitle: { color: COLORS.white, fontFamily: 'PoppinsBold', fontSize: 18 },

  resumoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginHorizontal: 20, marginTop: 18, marginBottom: 6,
  },
  resumoCard: {
    backgroundColor: COLORS.white, borderRadius: 14,
    paddingVertical: 12, paddingHorizontal: 14,
    alignItems: 'center', flex: 1, marginHorizontal: 4,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
  },
  resumoCardDestaque: { backgroundColor: COLORS.primary },
  resumoNumero: { fontFamily: 'PoppinsBold', fontSize: 20, color: COLORS.primary, marginTop: 2 },
  resumoLabel: { fontFamily: 'PoppinsSemiBold', fontSize: 11, color: COLORS.gray },

  filtrosContainer: { flexDirection: 'row', marginHorizontal: 20, marginVertical: 14, gap: 8 },
  filtroBtn: {
    paddingVertical: 7, paddingHorizontal: 18, borderRadius: 20,
    borderWidth: 1.5, borderColor: COLORS.primary,
  },
  filtroBtnAtivo: { backgroundColor: COLORS.primary },
  filtroText: { fontFamily: 'PoppinsSemiBold', fontSize: 13, color: COLORS.primary },
  filtroTextAtivo: { color: COLORS.white },

  listContent: { paddingHorizontal: 20, paddingBottom: 30 },

  card: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    borderRadius: 16, padding: 14, marginBottom: 14,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.09,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 5,
  },
  capaWrapper: { position: 'relative', marginRight: 14 },
  bookImage: { width: 80, height: 118, borderRadius: 10 },
  bookImagePlaceholder: {
    width: 80, height: 118, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', padding: 6,
  },
  capaLetra: { color: 'rgba(255,255,255,0.4)', fontSize: 22, fontFamily: 'PoppinsBold' },
  capaTitulo: { color: '#fff', fontFamily: 'PoppinsBold', fontSize: 9, textAlign: 'center', lineHeight: 12, marginTop: 4 },
  capaAutor: { color: 'rgba(255,255,255,0.7)', fontFamily: 'PoppinsSemiBold', fontSize: 8, textAlign: 'center', marginTop: 4 },
  formatoBadge: { position: 'absolute', bottom: 6, left: 0, right: 0, alignItems: 'center' },
  formatoText: {
    backgroundColor: 'rgba(0,0,0,0.55)', color: '#fff',
    fontSize: 9, fontFamily: 'PoppinsSemiBold',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
  },

  cardInfo: { flex: 1, justifyContent: 'space-between' },
  bookTitle: { fontFamily: 'PoppinsBold', fontSize: 14, color: '#333', marginBottom: 2 },
  bookAuthor: { fontFamily: 'PoppinsSemiBold', fontSize: 12, color: COLORS.gray, marginBottom: 8 },

  // ── Botão cíclico de status ──
  statusCycleBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 10, borderWidth: 1.5,
    marginBottom: 8,
  },
  statusCycleIcon: { fontSize: 14 },
  statusCycleLabel: { fontFamily: 'PoppinsSemiBold', fontSize: 12, flex: 1 },

  categoriaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  categoriaText: { fontFamily: 'PoppinsSemiBold', fontSize: 10, color: COLORS.gray },
  progressoTexto: { fontFamily: 'PoppinsSemiBold', fontSize: 10, color: COLORS.primary },

  progressoBar: { height: 5, backgroundColor: COLORS.lightGray, borderRadius: 10, overflow: 'hidden', marginBottom: 8 },
  progressoFill: { height: '100%', borderRadius: 10 },

  lerBtn: { alignSelf: 'flex-start' },
  lerBtnGradient: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 7, paddingHorizontal: 16, borderRadius: 20, gap: 5,
  },
  lerBtnText: { color: COLORS.white, fontFamily: 'PoppinsSemiBold', fontSize: 12 },

  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontFamily: 'PoppinsSemiBold', color: COLORS.gray, marginTop: 12, marginBottom: 20, fontSize: 15 },
  emptyBtn: { borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 24 },
  emptyBtnText: { color: COLORS.primary, fontFamily: 'PoppinsBold', fontSize: 14 },
});