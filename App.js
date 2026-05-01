import 'react-native-gesture-handler';
import React from "react";
import { registerRootComponent } from 'expo';
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from 'expo-font';

import BookDetailsScreen from "./src/screens/BookDetailsScreen";
import LoginScreen from "./src/screens/LoginScreen";
import CadastroScreen from "./src/screens/CadastroScreen";
import EsqueciSenhaScreen from "./src/screens/EsqueciSenhaScreen";
import CarrinhoScreen from "./src/screens/CarrinhoScreen";
import PagamentoScreen from "./src/screens/PagamentoScreen";
import CategoriaScreen from "./src/screens/CategoriaScreen";
import MeusLivrosScreen from "./src/screens/MeusLivrosScreen";
import HomeScreen from "./src/screens/HomeScreen";
import PerfilScreen from "./src/screens/PerfilScreen";
import MeusPedidosScreen from "./src/screens/MeusPedidosScreen";
import AdminLivrosScreen from "./src/screens/AdminLivrosScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import CartaoDadosScreen from './src/screens/CartaoDadosScreen';

const Stack = createNativeStackNavigator();

function Routes() {
  return (
    <NavigationContainer theme={DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="EsqueciSenha" component={EsqueciSenhaScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Categoria" component={CategoriaScreen} />
        <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
        <Stack.Screen name="Carrinho" component={CarrinhoScreen} />
        <Stack.Screen name="Pagamento" component={PagamentoScreen} />
        <Stack.Screen name="Biblioteca" component={MeusLivrosScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="MeusPedidos" component={MeusPedidosScreen} />
        <Stack.Screen name="AdminLivros" component={AdminLivrosScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="CartaoDados" component={CartaoDadosScreen} options={{ headerShown: false }} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    PoppinsBold: require('./assets/fonts/Poppins-Bold.ttf'),
    PoppinsSemiBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return <Routes />;
}

registerRootComponent(App);