import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, ScrollView,
  Image, Dimensions, TouchableOpacity, Modal, FlatList, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

import carousel from '../../assets/carrosel_1.jpg';
import book1 from '../../assets/book1.jpg';
import book2 from '../../assets/book2.jpg';
import book3 from '../../assets/book3.jpg';
import book4 from '../../assets/book4.jpg';
import book5 from '../../assets/book5.jpg';
import book6 from '../../assets/book6.jpg';
import book7 from '../../assets/book7.jpg';
import book8 from '../../assets/book8.png';

const COLORS = {
  primary: '#AE0000',
  primaryLight: '#C94040',
  primaryDark: '#8B0000',
  background: '#FAF6EF',
  card: '#FFFFFF',
  text: '#2C2C2C',
  textMuted: '#888',
  gold: '#F5A623',
  white: '#FFFFFF',
};

const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = (screenWidth - 52) / 3;

const StarRating = ({ rating = 0, size = 14 }) => {
  const stars = [];
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  for (let i = 1; i <= 5; i++) {
    if (i <= full) stars.push(<Ionicons key={i} name="star" size={size} color={COLORS.gold} />);
    else if (i === full + 1 && hasHalf) stars.push(<Ionicons key={i} name="star-half" size={size} color={COLORS.gold} />);
    else stars.push(<Ionicons key={i} name="star-outline" size={size} color={COLORS.gold} />);
  }
  return <View style={{ flexDirection: 'row', alignItems: 'center' }}>{stars}</View>;
};

// Livros fixos com dados completos (mesmos do CategoriaScreen)
const popularBooks = [
  {
    id: 'f1', image: book1,
    title: 'The Shining', author: 'Stephen King',
    price: 45.90, rating: 5, category: 'Terror', formato: 'eBook', paginas: 447,
    descricao: 'A trama segue a família Torrance: Jack, sua esposa Wendy e seu filho pequeno, Danny. Eles se mudam para o remoto Hotel Overlook, no estado do Colorado, durante a baixa temporada. Jack espera que o isolamento e a paz do local ajudem a curar seu bloqueio criativo e a salvar seu casamento. No entanto, o hotel possui um passado macabro e é assombrado por entidades sobrenaturais. À medida que a neve os prende no local, a sanidade de Jack se deteriora rapidamente sob a influência dessas presenças, colocando sua família em perigo mortal',
  },
  {
    id: 'f2', image: book7,
    title: 'It: A Coisa', author: 'Stephen King',
    price: 102.90, rating: 5, category: 'Terror', formato: 'eBook', paginas: 1104,
    descricao: 'Em Derry, Maine, sete crianças se unem para enfrentar uma força maligna que assombra a cidade a cada 27 anos, assumindo a forma dos maiores medos de suas vítimas. Décadas depois, elas são convocadas novamente para terminar o que começaram.',
  },
  {
    id: 'f3', image: book2,
    title: 'A Sutil Arte de Ligar o F*da-se', author: 'Mark Manson',
    price: 34.90, rating: 4, category: 'Autoajuda', formato: 'eBook', paginas: 224,
    descricao: 'Uma abordagem inovadora e sem rodeios para uma vida melhor. Mark Manson argumenta que a chave para ser mais feliz e mais satisfeito com a vida não é tentar ser mais positivo, mas aprender a enfrentar nossas limitações e incertezas.',
  },
  {
    id: 'f4', image: book3,
    title: 'A Bailarina de Auschwitz', author: 'Edith Eva Eger',
    price: 42.00, rating: 5, category: 'Autoajuda', formato: 'eBook', paginas: 304,
    descricao: 'Em 1944, Edith Eger tinha 16 anos quando foi enviada a Auschwitz. Este livro é sua história de sobrevivência, resiliência e cura — de como transformou o trauma em liberdade e tornou-se uma das mais respeitadas psicólogas do mundo.',
  },
  {
    id: 'f5', image: book5,
    title: 'Ficção Científica 1', author: 'Autor X',
    price: 39.90, rating: 3, category: 'Ficção', formato: 'eBook', paginas: 320,
    descricao: 'Uma emocionante aventura pelo espaço sideral que desafia os limites da imaginação. Em um futuro distante, a humanidade enfrenta seus maiores desafios entre estrelas e civilizações desconhecidas.',
  },
  {
    id: 'f6', image: book6,
    title: 'Ficção Científica 2', author: 'Autor Y',
    price: 29.90, rating: 3, category: 'Ficção', formato: 'eBook', paginas: 280,
    descricao: 'A continuação da saga espacial que conquistou leitores ao redor do mundo. Novos mundos, novas ameaças e personagens inesquecíveis em uma narrativa que prende do início ao fim.',
  },
];

// Miniaturas dos livros da estante (para o card "Minha Estante")
const estantePreview = [book8, book3, book2];

export default function HomeScreen({ navigation, route }) {
  const user = route?.params?.user || {};
  const [menuVisible, setMenuVisible] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${Constants.expoConfig.extra.apiUrl}/api/books`)
      .then(res => res.json())
      .then(data => { setBooks(data); setLoading(false); })
      .catch(err => { console.error('Erro ao buscar livros:', err); setLoading(false); });
  }, []);

  const handleNavigate = (categoria) => {
    setMenuVisible(false);
    navigation.navigate('Categoria', { tipo: categoria, user });
  };

  const renderBookCard = ({ item }) => (
    <TouchableOpacity
      style={styles.gridCard}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('BookDetails', {
        book: { ...item, image: item.cover_url ? { uri: item.cover_url } : book1 },
        user,
      })}
    >
      <View style={styles.gridCoverWrapper}>
        <Image
          source={item.cover_url ? { uri: item.cover_url } : book1}
          style={styles.gridImage}
          resizeMode="cover"
        />
        <View style={styles.gridSpine} />
      </View>
      <View style={styles.gridInfo}>
        <Text style={styles.gridTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.gridAuthor} numberOfLines={1}>{item.author}</Text>
        <StarRating rating={parseFloat(item.rating) || 0} size={10} />
        {item.price > 0 ? (
          <Text style={styles.gridPrice}>R$ {Number(item.price).toFixed(2)}</Text>
        ) : (
          <View style={styles.gridFreeBadge}>
            <Text style={styles.gridFreeText}>Grátis</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <View style={styles.statusBarAbsolute} />

      {/* Menu lateral */}
      <Modal animationType="fade" transparent visible={menuVisible} onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.menuHeader}>
              <Ionicons name="book" size={32} color="#fff" />
              <Text style={styles.menuHeaderTitle}>AureaLitera</Text>
            </LinearGradient>
            <Text style={styles.menuSectionLabel}>Categorias</Text>
            {[
              { label: 'Terror',    icon: 'skull-outline'    },
              { label: 'Autoajuda', icon: 'heart-outline'    },
              { label: 'Ficção',    icon: 'rocket-outline'   },
              { label: 'Romance',   icon: 'rose-outline'     },
              { label: 'Fantasia',  icon: 'sparkles-outline' },
              { label: 'Suspense',  icon: 'eye-outline'      },
              { label: 'Biografia', icon: 'person-outline'   },
              { label: 'Infantil',  icon: 'happy-outline'    },
              { label: 'Outros',    icon: 'grid-outline'     },
            ].map(({ label, icon }) => (
              <TouchableOpacity key={label} style={styles.menuItem} onPress={() => handleNavigate(label)}>
                <View style={styles.menuIconBox}>
                  <Ionicons name={icon} size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.menuItemText}>{label}</Text>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        <View style={{ height: 60 }} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Bem-vindo de volta</Text>
          <Text style={styles.headerGreeting}>Hoje é um ótimo dia para ler.</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
            <Ionicons name="menu" size={26} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={COLORS.textMuted} />
            <TextInput placeholder="Buscar livros..." style={styles.input} placeholderTextColor={COLORS.textMuted} />
          </View>
        </View>

        {/* ── Minha Estante ── */}
        <Text style={styles.sectionTitle}>Minha Estante</Text>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => navigation.navigate('Biblioteca')}
        >
          <LinearGradient
            colors={[COLORS.primary, '#6B1A1A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            {/* Miniaturas empilhadas dos livros */}
            <View style={styles.estanteCovers}>
              {estantePreview.map((img, i) => (
                <Image
                  key={i}
                  source={img}
                  style={[
                    styles.estanteCover,
                    { marginLeft: i === 0 ? 0 : -18, zIndex: estantePreview.length - i,
                      transform: [{ rotate: `${(i - 1) * 5}deg` }] },
                  ]}
                  resizeMode="cover"
                />
              ))}
            </View>

            {/* Texto + CTA */}
            <View style={{ flex: 1, paddingHorizontal: 14 }}>
              <Text style={styles.estanteLabel}>Minha Estante</Text>
              <Text style={styles.estanteSubtitle}>3 livros · 1 lendo agora</Text>
              <View style={styles.estanteBadgeRow}>
                <View style={styles.estanteBadge}>
                  <Text style={styles.estanteBadgeText}>📖 Em leitura</Text>
                </View>
              </View>
              <View style={styles.estanteCta}>
                <Text style={styles.estanteCtaText}>Continuar lendo</Text>
                <Ionicons name="arrow-forward" size={14} color="#fff" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Banner */}
        <View style={styles.banner}>
          <Image source={carousel} style={styles.bannerImage} resizeMode="cover" />
          <LinearGradient colors={['rgba(174,0,0,0.85)', 'transparent']} style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>🔥 10% OFF em Frankenstein</Text>
          </LinearGradient>
        </View>

        {/* Mais procurados */}
        <View style={styles.popularContainer}>
          <Text style={styles.popularTitle}>Mais procurados</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15 }}>
            {popularBooks.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.popularItem}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('BookDetails', { book: item, user })}
              >
                <Image source={item.image} style={styles.popularBook} resizeMode="cover" />
                <View style={styles.popularShine} />
                <View style={styles.popularLabel}>
                  <Text style={styles.popularLabelText} numberOfLines={1}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Catálogo em grade */}
        <View style={styles.catalogSection}>
          <View style={styles.catalogHeader}>
            <Text style={styles.catalogTitle}>Nosso Catálogo</Text>
            {books.length > 0 && <Text style={styles.catalogCount}>{books.length} livros</Text>}
          </View>

          {loading ? (
            <ActivityIndicator color="#fff" size="large" style={{ marginTop: 30, marginBottom: 30 }} />
          ) : books.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={48} color="rgba(255,255,255,0.4)" />
              <Text style={styles.emptyText}>Nenhum livro cadastrado ainda.</Text>
            </View>
          ) : (
            <FlatList
              data={books}
              renderItem={renderBookCard}
              keyExtractor={(item) => String(item.id)}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={styles.gridRow}
              contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 16 }}
            />
          )}
        </View>
      </ScrollView>

      {/* Bottom Tab */}
      <View style={styles.bottomTab}>
        {[
          { screen: 'Carrinho',   icon: 'bag',    label: 'Carrinho'   },
          { screen: 'Biblioteca', icon: 'book',   label: 'Biblioteca' },
          { screen: 'Perfil',     icon: 'person', label: 'Perfil'     },
        ].map(({ screen, icon, label }) => (
          <TouchableOpacity key={screen} style={styles.tabItem} onPress={() => navigation.navigate(screen, { user })}>
            <Ionicons name={icon} size={22} color="white" />
            <Text style={styles.tabLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  statusBarAbsolute: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 40, backgroundColor: COLORS.primary, zIndex: 10,
  },

  header: { paddingHorizontal: 20, paddingTop: 1, paddingBottom: 10 },
  headerGreeting: { fontSize: 16, color: COLORS.textMuted, fontFamily: 'PoppinsSemiBold' },
  headerText: { fontSize: 26, fontFamily: 'PoppinsBold', color: COLORS.text },

  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 20, gap: 10,
  },
  menuButton: {
    backgroundColor: COLORS.primary, padding: 10,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#EDEBE6', paddingHorizontal: 14,
    paddingVertical: 11, borderRadius: 14, gap: 8,
  },
  input: { flex: 1, fontFamily: 'PoppinsSemiBold', fontSize: 14, color: COLORS.text },

  sectionTitle: {
    marginHorizontal: 16, fontFamily: 'PoppinsBold',
    fontSize: 18, color: COLORS.text, marginBottom: 12,
  },

  // ── Card Minha Estante ──
  card: {
    marginHorizontal: 16, marginBottom: 20, borderRadius: 18,
    padding: 16, flexDirection: 'row', alignItems: 'center',
    elevation: 6, shadowColor: COLORS.primary, shadowOpacity: 0.3,
    shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
  },
  estanteCovers: {
    flexDirection: 'row', alignItems: 'flex-end', height: 90,
  },
  estanteCover: {
    width: 52, height: 80, borderRadius: 7,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)',
  },
  estanteLabel: {
    color: '#fff', fontFamily: 'PoppinsBold', fontSize: 17, marginBottom: 2,
  },
  estanteSubtitle: {
    color: 'rgba(255,255,255,0.7)', fontFamily: 'PoppinsSemiBold', fontSize: 12, marginBottom: 8,
  },
  estanteBadgeRow: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  estanteBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 10,
    paddingVertical: 3, borderRadius: 20,
  },
  estanteBadgeText: { color: '#fff', fontFamily: 'PoppinsSemiBold', fontSize: 11 },
  estanteCta: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
  },
  estanteCtaText: {
    color: '#FFD700', fontFamily: 'PoppinsBold', fontSize: 13,
  },

  // Banner
  banner: { marginHorizontal: 16, marginBottom: 24, borderRadius: 18, overflow: 'hidden', elevation: 3 },
  bannerImage: { width: '100%', height: 180 },
  bannerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, paddingVertical: 14, paddingHorizontal: 18 },
  bannerText: { color: '#fff', fontFamily: 'PoppinsBold', fontSize: 16 },

  // Popular horizontal
  popularContainer: { marginBottom: 28 },
  popularTitle: { fontFamily: 'PoppinsBold', color: COLORS.text, fontSize: 18, marginHorizontal: 16, marginBottom: 12 },
  popularItem: { marginRight: 12, borderRadius: 12, overflow: 'hidden', elevation: 4 },
  popularBook: { width: 100, height: 148, borderRadius: 12 },
  popularShine: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 40,
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12,
  },
  popularLabel: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.55)', paddingVertical: 5, paddingHorizontal: 6,
  },
  popularLabelText: {
    color: '#fff', fontFamily: 'PoppinsSemiBold', fontSize: 9, textAlign: 'center',
  },

  // Catálogo
  catalogSection: { backgroundColor: COLORS.primary, paddingTop: 15 },
  catalogHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 15, marginBottom: 14,
  },
  catalogTitle: { fontFamily: 'PoppinsBold', fontSize: 18, color: COLORS.white },
  catalogCount: { fontFamily: 'PoppinsSemiBold', fontSize: 13, color: 'rgba(255,255,255,0.65)' },

  gridRow: { justifyContent: 'space-between', marginBottom: 18 },
  gridCard: {
    width: CARD_WIDTH, backgroundColor: COLORS.card,
    borderRadius: 10, overflow: 'hidden', elevation: 3,
    shadowColor: '#000000', shadowOpacity: 0.10,
    shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
  },
  gridCoverWrapper: {
    width: '100%', height: CARD_WIDTH * 1.45, backgroundColor: '#d6cfc6',
  },
  gridImage: { width: '100%', height: '100%' },
  gridInfo: {
    paddingHorizontal: 7, paddingTop: 7, paddingBottom: 9,
    backgroundColor: COLORS.card, gap: 2,
  },
  gridTitle: { fontFamily: 'PoppinsBold', fontSize: 10, color: COLORS.text, lineHeight: 14 },
  gridAuthor: { fontFamily: 'PoppinsSemiBold', fontSize: 9, color: COLORS.textMuted, marginBottom: 2 },
  gridPrice: { fontFamily: 'PoppinsBold', fontSize: 10, color: COLORS.primary, marginTop: 3 },
  gridFreeBadge: {
    marginTop: 3, alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4,
  },
  gridFreeText: { fontFamily: 'PoppinsBold', fontSize: 9, color: '#2E7D32' },

  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: 'rgba(255,255,255,0.6)', fontFamily: 'PoppinsSemiBold', marginTop: 12, fontSize: 14 },

  // Bottom tab
  bottomTab: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: COLORS.primary, paddingVertical: 10,
    paddingBottom: 16, position: 'absolute', bottom: 0, width: '100%',
    elevation: 12, shadowColor: COLORS.primary, shadowOpacity: 0.4,
    shadowRadius: 10, shadowOffset: { width: 0, height: -2 },
  },
  tabItem: { alignItems: 'center', gap: 3 },
  tabLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 10, fontFamily: 'PoppinsSemiBold' },

  // Modal menu
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-start' },
  menuContainer: {
    backgroundColor: COLORS.background, width: '72%', height: '100%',
    borderTopRightRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden',
  },
  menuHeader: {
    paddingTop: 40, paddingBottom: 28, paddingHorizontal: 24,
    alignItems: 'center', gap: 10,
  },
  menuHeaderTitle: { color: '#fff', fontFamily: 'PoppinsBold', fontSize: 20 },
  menuSectionLabel: {
    fontFamily: 'PoppinsBold', color: COLORS.textMuted,
    fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase',
    marginHorizontal: 20, marginTop: 24, marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#EDEBE6',
  },
  menuIconBox: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#F5EDE8',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  menuItemText: { flex: 1, fontSize: 16, fontFamily: 'PoppinsSemiBold', color: COLORS.text },
});