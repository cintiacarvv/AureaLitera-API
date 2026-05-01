import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

import book1 from '../../assets/book1.jpg';
import book2 from '../../assets/book2.jpg';
import book3 from '../../assets/book3.jpg';

const COLORS = {
  primary: '#AE0000',
  background: '#FAF6EF',
  white: '#FFFFFF',
  text: '#555',
  gray: '#999',
  lightGray: '#eee',
};

const screenWidth = Dimensions.get('window').width;

const MEUS_LIVROS = [
  {
    id: '1',
    title: 'A Bailarina de Auschwitz',
    author: 'Edith Eva Eger',
    image: book3,
    progresso: 65,
    paginas: 304,
    formato: 'eBook',
  },
  {
    id: '2',
    title: 'A Sutil Arte de Ligar o F*da-se',
    author: 'Mark Manson',
    image: book2,
    progresso: 100,
    paginas: 256,
    formato: 'eBook',
  },
  {
    id: '3',
    title: 'The Shining',
    author: 'Stephen King',
    image: book1,
    progresso: 20,
    paginas: 447,
    formato: 'eBook',
  },
];

export default function MeusLivrosScreen({ navigation }) {
  const [filtro, setFiltro] = useState('Todos'); 

  const livrosFiltrados = MEUS_LIVROS.filter((livro) => {
    if (filtro === 'Lendo') return livro.progresso > 0 && livro.progresso < 100;
    if (filtro === 'Concluídos') return livro.progresso === 100;
    return true;
  });

  const emLeitura = MEUS_LIVROS.filter(
    (l) => l.progresso > 0 && l.progresso < 100
  );
  const concluidos = MEUS_LIVROS.filter((l) => l.progresso === 100);

  const renderFiltro = (label) => (
    <TouchableOpacity
      key={label}
      style={[styles.filtroBtn, filtro === label && styles.filtroBtnAtivo]}
      onPress={() => setFiltro(label)}
    >
      <Text
        style={[
          styles.filtroText,
          filtro === label && styles.filtroTextAtivo,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderLivro = ({ item }) => {
    const concluido = item.progresso === 100;
    const paginasLidas = Math.round((item.progresso / 100) * item.paginas);

    return (
      <View style={styles.card}>
        <Image source={item.image} style={styles.bookImage} />

        <View style={styles.cardInfo}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.bookAuthor}>{item.author}</Text>

          <View style={styles.progressoContainer}>
            <View style={styles.progressoBar}>
              <View
                style={[
                  styles.progressoFill,
                  { width: `${item.progresso}%` },
                  concluido && styles.progressoFillConcluido,
                ]}
              />
            </View>
            <Text style={styles.progressoText}>{item.progresso}%</Text>
          </View>

          <Text style={styles.paginasText}>
            {concluido
              ? `✓ Concluído · ${item.paginas} páginas`
              : `${paginasLidas} / ${item.paginas} páginas`}
          </Text>

          <TouchableOpacity
            style={styles.lerBtn}
            onPress={() =>
              navigation.navigate('Leitor', { livro: item })
            }
          >
            <LinearGradient
              colors={['#AE0000', '#8E5050']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.lerBtnGradient}
            >
              <Ionicons
                name={concluido ? 'refresh-outline' : 'book-outline'}
                size={14}
                color="#fff"
              />
              <Text style={styles.lerBtnText}>
                {concluido ? 'Reler' : 'Continuar lendo'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Livros</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.resumoRow}>
        <View style={styles.resumoCard}>
          <Text style={styles.resumoNumero}>{MEUS_LIVROS.length}</Text>
          <Text style={styles.resumoLabel}>Total</Text>
        </View>
        <View style={[styles.resumoCard, styles.resumoCardDestaque]}>
          <Text style={[styles.resumoNumero, { color: COLORS.white }]}>
            {emLeitura.length}
          </Text>
          <Text style={[styles.resumoLabel, { color: COLORS.white }]}>
            Lendo
          </Text>
        </View>
        <View style={styles.resumoCard}>
          <Text style={styles.resumoNumero}>{concluidos.length}</Text>
          <Text style={styles.resumoLabel}>Concluídos</Text>
        </View>
      </View>

      <View style={styles.filtrosContainer}>
        {['Todos', 'Lendo', 'Concluídos'].map(renderFiltro)}
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
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.emptyBtnText}>Explorar livros</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
  },
  headerTitle: {
    color: COLORS.white,
    fontFamily: 'PoppinsBold',
    fontSize: 18,
  },

  
  resumoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  resumoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  resumoCardDestaque: {
    backgroundColor: COLORS.primary,
  },
  resumoNumero: {
    fontFamily: 'PoppinsBold',
    fontSize: 22,
    color: COLORS.primary,
  },
  resumoLabel: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 12,
    color: COLORS.gray,
  },

  filtrosContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 15,
    gap: 10,
  },
  filtroBtn: {
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  filtroBtnAtivo: {
    backgroundColor: COLORS.primary,
  },
  filtroText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 13,
    color: COLORS.primary,
  },
  filtroTextAtivo: {
    color: COLORS.white,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookImage: {
    width: 75,
    height: 110,
    borderRadius: 8,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontFamily: 'PoppinsBold',
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 2,
  },
  bookAuthor: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 8,
  },

  progressoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressoBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressoFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  progressoFillConcluido: {
    backgroundColor: '#4CAF50',
  },
  progressoText: {
    fontFamily: 'PoppinsBold',
    fontSize: 12,
    color: COLORS.primary,
    minWidth: 32,
    textAlign: 'right',
  },
  paginasText: {
    fontFamily: 'PoppinsSemiBold',
    fontSize: 11,
    color: COLORS.gray,
    marginBottom: 8,
  },

  lerBtn: {
    alignSelf: 'flex-start',
  },
  lerBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 5,
  },
  lerBtnText: {
    color: COLORS.white,
    fontFamily: 'PoppinsSemiBold',
    fontSize: 12,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontFamily: 'PoppinsSemiBold',
    color: COLORS.gray,
    marginTop: 12,
    marginBottom: 20,
    fontSize: 15,
  },
  emptyBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  emptyBtnText: {
    color: COLORS.primary,
    fontFamily: 'PoppinsBold',
    fontSize: 14,
  },
});