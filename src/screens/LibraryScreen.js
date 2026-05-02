// Arquivo: src/screens/LibraryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import { ApiService } from '../services/apiService';

const LibraryScreen = () => {
    const [myBooks, setMyBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Mock de ID do usuário logado (MVP)
    const currentUserId = 1; 

    // Carregar a biblioteca ao abrir a tela (Consumo US05)
    useEffect(() => {
        fetchMyLibrary();
    }, []);

    const fetchMyLibrary = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getLibrary(currentUserId);
            setMyBooks(data);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar sua estante virtual.');
        } finally {
            setLoading(false);
        }
    };

    // Simular o progresso de leitura/áudio e sincronizar com o backend (Consumo US07)
    const handleUpdateProgress = async (bookId, currentProgress) => {
        try {
            // Simula que o usuário leu mais 10%
            const newProgress = Math.min(currentProgress + 10, 100); 
            
            await ApiService.syncProgress(currentUserId, bookId, newProgress);
            
            // Atualiza a lista na tela para refletir o novo progresso
            fetchMyLibrary(); 
            console.log(`Progresso do livro ${bookId} salvo na nuvem com sucesso!`);
        } catch (error) {
            Alert.alert('Erro de Sincronização', 'Progresso salvo localmente, tentaremos sincronizar depois.');
        }
    };

    const renderBookItem = ({ item }) => (
        <View style={{ padding: 15, borderBottomWidth: 1, borderColor: '#ccc' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
            <Text>Formato: {item.format}</Text>
            <Text>Progresso: {item.progress_percentage}%</Text>
            <Text>Último acesso: {new Date(item.last_accessed).toLocaleDateString()}</Text>
            
            {(item.format === 'ebook' || item.format === 'audiobook') && (
                <Button 
                    title="Avançar Leitura/Áudio (+10%)" 
                    onPress={() => handleUpdateProgress(item.id, item.progress_percentage)} 
                />
            )}
        </View>
    );

    return (
        <View style={{ flex: 1, padding: 10 }}>
            {loading ? (
                <Text>Carregando sua estante virtual...</Text>
            ) : (
                <FlatList
                    data={myBooks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderBookItem}
                    ListEmptyComponent={<Text>Sua biblioteca está vazia.</Text>}
                />
            )}
        </View>
    );
};

export default LibraryScreen;