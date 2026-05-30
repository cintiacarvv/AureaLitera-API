import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@AureaLitera:livros';

export const bookService = {
  salvar: async (novoLivro) => {
    try {
      const storageValue = await AsyncStorage.getItem(STORAGE_KEY);
      const livrosExistentes = storageValue ? JSON.parse(storageValue) : [];

      if (novoLivro.location === 'catalogo') {
        const totalNoCatalogo = livrosExistentes.filter(l => l.location === 'catalogo').length;
        if (totalNoCatalogo >= 6) {
          throw new Error("Limite de 6 livros no catálogo atingido!");
        }
      }

      if (novoLivro.location === 'recomendados') {
        const totalRecomendados = livrosExistentes.filter(l => l.location === 'recomendados').length;
        if (totalRecomendados >= 5) {
          throw new Error("Limite de 5 livros em recomendados atingido!");
        }
      }

      const listaAtualizada = [...livrosExistentes, novoLivro];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada));
      
      return { status: 201 };
    } catch (error) {
      throw error;
    }
  },

  listarTodos: async () => {
    try {
      const storageValue = await AsyncStorage.getItem(STORAGE_KEY);
      const dynamicBooks = storageValue ? JSON.parse(storageValue) : [];
      
      const fixedBooks = [
        { id: "fixo_rec_1", title: "A sutil arte de ligar o fod*-se", author: "Mark Manson", price: "35.50", image: require('../../assets/book2.jpg'), location: "recomendados", category: "Infantil", description: "Uma abordagem surpreendente e libertadora para viver uma vida melhor." },
        { id: "fixo_rec_2", title: "A bailarina de Auschwitz", author: "Edith Eva Eger", price: "29.90", image: require('../../assets/book3.jpg'), location: "recomendados", category: "Autoajuda", description: "Uma história inesquecível de superação e escolha pela vida." },
        { id: "fixo_cat_1", title: "Todas as coisas que eu te escreveria se eu pudesse", author: "Igor Pires", price: "45.90", image: require('../../assets/book4.jpg'), location: "catalogo", category: "Terror", description: "Poemas e textos sobre amor, saudade e recomeços." },
        { id: "fixo_cat_2", title: "Textos para tocar cicatrizes", author: "Igor Pires", price: "39.90", image: require('../../assets/book5.jpg'), location: "catalogo", category: "Autoajuda", description: "Sobre feridas que carregamos e a coragem de deixá-las curar." },
        { id: "fixo_cat_3", title: "Cartas de um diabo a seu aprendiz", author: "C.S. Lewis", price: "30.00", image: require('../../assets/book6.jpg'), location: "catalogo", category: "Infantil", description: "Uma sátira genial sobre a natureza da tentação humana." }
      ];

      return [...fixedBooks, ...dynamicBooks];
    } catch (error) {
      console.error("Erro ao listar livros:", error);
      return [];
    }
  },

  atualizar: async (bookEditado) => {
    try {
      const storageValue = await AsyncStorage.getItem(STORAGE_KEY);
      const livros = storageValue ? JSON.parse(storageValue) : [];
      
      const listaAtualizada = livros.map(livro => 
        livro.id === bookEditado.id ? { ...livro, ...bookEditado } : livro
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaAtualizada));
      return { status: 200 };
    } catch (error) {
      console.error("Erro ao atualizar livro:", error);
      throw error;
    }
  },

  remover: async (id) => {
    try {
      const storageValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (storageValue) {
        const livros = JSON.parse(storageValue);
        const listaFiltrada = livros.filter(livro => livro.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaFiltrada));
      }
      return { status: 200 };
    } catch (error) {
      console.error("Erro ao remover livro:", error);
      throw error;
    }
  }
};