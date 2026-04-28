//import 'react-native-reanimated';
import 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from 'expo-font';

import BookDetailsScreen from "./src/screens/BookDetailsScreen";
import LoginScreen from "./src/screens/LoginScreen";
import CadastroScreen from "./src/screens/CadastroScreen";
import EsqueciSenhaScreen from "./src/screens/EsqueciSenhaScreen";
import CarrinhoScreen from "./src/screens/CarrinhoScreen";
import PagamentoScreen from "./src/screens/PagamentoScreen";
import CategoriaScreen from "./src/screens/CategoriaScreen";

import HomeScreen from "./src/screens/HomeScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    PoppinsBold: require('./assets/fonts/Poppins-Bold.ttf'),
    PoppinsSemiBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="EsqueciSenha" component={EsqueciSenhaScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Categoria" component={CategoriaScreen} />
        <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
        <Stack.Screen name="Carrinho" component={CarrinhoScreen} />
        
        <Stack.Screen name="Pagamento" component={PagamentoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}