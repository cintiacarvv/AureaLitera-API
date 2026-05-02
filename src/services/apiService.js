// Arquivo: src/services/apiService.js

// ATENÇÃO: Para testar em emuladores Android ou celular físico na mesma rede Wi-Fi, 
// troque 'localhost' pelo IP da sua máquina (ex: 'http://192.168.1.15:3000/api')
const BASE_URL = 'http://10.0.2.2:3000/api'; // 10.0.2.2 é o alias do localhost no emulador Android

export const ApiService = {
  
    // US01 – Busca com Filtro por Formato
    getBooks: async (format = null) => {
        try {
            let url = `${BASE_URL}/books`;
            if (format) {
                url += `?format=${format}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Erro ao buscar catálogo');
            
            return await response.json();
        } catch (error) {
            console.error("Erro em getBooks:", error);
            throw error;
        }
    },

    // US05 – Acesso à Biblioteca Digital
    getLibrary: async (userId) => {
        try {
            const response = await fetch(`${BASE_URL}/library/${userId}`);
            if (!response.ok) throw new Error('Erro ao buscar biblioteca do usuário');
            
            return await response.json();
        } catch (error) {
            console.error("Erro em getLibrary:", error);
            throw error;
        }
    },

    // US07 – Sincronização de progresso (Salvar na nuvem)
    syncProgress: async (userId, bookId, progressPercentage) => {
        try {
            const response = await fetch(`${BASE_URL}/sync-progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    book_id: bookId,
                    progress_percentage: progressPercentage
                }),
            });

            if (!response.ok) throw new Error('Erro ao sincronizar progresso');
            
            return await response.json();
        } catch (error) {
            console.error("Erro em syncProgress:", error);
            // Aqui entraria a lógica de "Offline Caching" citada no PDF (salvar no AsyncStorage e tentar depois)
            throw error;
        }
    }
};