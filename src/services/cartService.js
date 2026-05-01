import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = '@AureaLitera:carrinho';

export const cartService = {
  adicionarAoCarrinho: async (livro) => {
    try {
      const jsonValue = await AsyncStorage.getItem(CART_KEY);
      const carrinho = jsonValue != null ? JSON.parse(jsonValue) : [];
      
      const jaExiste = carrinho.find(item => item.id === livro.id);
      
      if (!jaExiste) {
        carrinho.push(livro);
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(carrinho));
      }
      return { status: 200, data: carrinho };
    } catch (e) {
      console.error("Erro ao adicionar produto", e);
      return { status: 500 };
    }
  },

  listarItens: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(CART_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error("Erro ao listar itens", e);
      return [];
    }
  },

  removerDoCarrinho: async (id) => {
    try {
      const jsonValue = await AsyncStorage.getItem(CART_KEY);
      const carrinho = jsonValue != null ? JSON.parse(jsonValue) : [];
      
      const novaLista = carrinho.filter(item => item.id !== id);
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(novaLista));
      
      return { status: 200, data: novaLista };
    } catch (e) {
      console.error("Erro ao remover item", e);
      return { status: 500 };
    }
  },

  limparCarrinho: async () => {
    try {
      await AsyncStorage.removeItem(CART_KEY);
      return { status: 200 };
    } catch (e) {
      console.error("Erro ao limpar carrinho", e);
      return { status: 500 };
    }
  }
};