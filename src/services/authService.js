
//M para cadastro e login. Aguardando URL do servidor para integração <3

import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  cadastrar: async (nome, email, senha) => {
    try {
      const storageValue = await AsyncStorage.getItem('@AureaLitera:todos_usuarios');
      const usuariosExistentes = storageValue ? JSON.parse(storageValue) : [];
      
      const novoUsuario = { nome, email, senha, role: 'USER' };
      const listaAtualizada = [...usuariosExistentes, novoUsuario];
      
      await AsyncStorage.setItem('@AureaLitera:todos_usuarios', JSON.stringify(listaAtualizada));
      return { status: 201 };
    } catch (error) {
      throw new Error("Erro ao salvar cadastro");
    }
  },

  login: async (email, senha) => {
    try {
      let usuarioEncontrado;

      if (email === 'admin@email.com' && senha === 'Admin@1') {
        usuarioEncontrado = { nome: 'Administrador', email: 'admin@email.com', role: 'ADMIN' };
      } else {
        const storageValue = await AsyncStorage.getItem('@AureaLitera:todos_usuarios');
        const usuarios = storageValue ? JSON.parse(storageValue) : [];
        usuarioEncontrado = usuarios.find(u => u.email === email && u.senha === senha);
      }

      if (usuarioEncontrado) {
        await AsyncStorage.setItem('@AureaLitera:usuario_logado', JSON.stringify(usuarioEncontrado));
        return { status: 200, data: { user: usuarioEncontrado } };
      } else {
        throw new Error("E-mail ou senha incorretos");
      }
    } catch (error) {
      throw new Error("Erro ao acessar dados de login");
    }
  }
};