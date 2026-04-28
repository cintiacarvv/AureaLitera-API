import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from 'expo-status-bar';

export default function BookDetailsScreen({ route }) {
  const { book, navigation } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      
      <StatusBar style="black" />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="#555" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <LinearGradient
          colors={['#AE0000', '#8E5050']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.card}
        >
          <Image source={book.image} style={styles.bookImage} />

          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>{book.author}</Text>

            <Text style={styles.price}>R$ 0,00</Text>

            <View style={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <Ionicons key={i} name="star" size={18} color="#FFD700" />
              ))}
            </View>

            <View style={styles.buyButtonContainer}>
              <TouchableOpacity style={styles.buyButton}>
                <Text style={styles.buyButtonText}>Comprar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

   
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Autor</Text>
            <Text style={styles.detailValue}>{book.author}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Formato</Text>
            <Text style={styles.detailValue}>eBook</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Páginas</Text>
            <Text style={styles.detailValue}>304</Text>
          </View>
        </View>

        <View style={styles.genreContainer}>
          <Text style={styles.genreTag}>Biografia</Text>
          <Text style={styles.genreTag}>Drama</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.tabTitle}>Descrição</Text>
          <Text style={styles.descriptionText}>
            Em A Bailarina de Auschwitz, Edith Eger compartilha uma história real, profunda e transformadora sobre sobrevivência, coragem e a capacidade humana de encontrar sentido mesmo nas situações mais devastadoras. Ainda adolescente, Edith sonhava em ser bailarina quando sua vida foi brutalmente interrompida pela Segunda Guerra Mundial. De origem judaica, ela e sua família foram levadas para o campo de concentração de Auschwitz, onde enfrentaram a fome, o medo e perdas irreparáveis. Em meio ao horror, Edith foi forçada a dançar para oficiais nazistas — um momento marcante que simboliza tanto a crueldade quanto a resistência do espírito humano.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF6EF",
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginLeft: 8,
  },

  card: {
  width: 400,        
  height: 270,         
  padding: 20,
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 20,
  alignSelf: "center",  
  borderRadius: 10, 
},
   

bookImage: {
  width: 110,           
  height: 180,            
  borderRadius: 10,
},


  bookInfo: {
    flex: 1,
    marginLeft: 15,
  },

  bookTitle: {
    color: "#fff",
    fontFamily: "PoppinsBold",
    fontSize: 18,
    marginBottom: 4,
  },

  bookAuthor: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 10,
    fontFamily: "PoppinsSemiBold",
  },

  price: {
    color: "#fff",
    fontFamily: "PoppinsSemiBold",
    fontSize: 16,
    marginBottom: 8,
  },

  rating: {
    flexDirection: "row",
    marginBottom: 12,
  },

  buyButtonContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: 10,
  },

  buyButton: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },

  buyButtonText: {
    color: "#AE0000",
    fontWeight: "bold",
  },

  detailsRow: {
  flexDirection: "row",
  justifyContent: "space-around",
  marginHorizontal: 15,
  marginBottom: 20,
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: "#ddd",
  paddingBottom: 10,
},

  detailItem: {
    alignItems: "center",
  },

  detailLabel: {
    fontFamily: "PoppinsBold",
    fontSize: 15,
    color: "#555",
    marginBottom: 4,
  },

  detailValue: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 13,
    color: "#555",
  },

  genreContainer: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginBottom: 20,
  },

  genreTag: {
    backgroundColor: "#AE0000",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    fontSize: 13,
    fontFamily: "PoppinsSemiBold",
  },

  descriptionContainer: {
  marginHorizontal: 15,
  borderTopWidth: StyleSheet.hairlineWidth,
  borderTopColor: "#ddd",
  paddingTop: 10,
},

  tabTitle: {
  fontFamily: "PoppinsBold",
  fontSize: 16,
  marginBottom: 8,
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: "#ccc",
  paddingBottom: 5,
},

  descriptionText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    textAlign: "justify",
  },
});