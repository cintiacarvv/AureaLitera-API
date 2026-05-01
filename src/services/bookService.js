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
      return storageValue ? JSON.parse(storageValue) : [];
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