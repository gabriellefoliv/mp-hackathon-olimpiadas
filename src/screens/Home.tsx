import React from 'react';
import { NavigationProps } from '../types/RootStackParamList';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home({ navigation }: NavigationProps<"Feed">) {

    return (
        <View style={styles.container}>
          <Text style={styles.title}>
            FilteringOlympics
          </Text>
            
            <View style={styles.box}>
                <Text style={styles.text}>
                    Com esse aplicativo você:
                </Text>
                <Text style={styles.text}>
                    ✅ acompanha o placar dos jogos ao vivo
                </Text>
                <Text style={styles.text}>
                    ✅ filtra os jogos por modalidade, gênero ou data
                </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Feed")} style={styles.button}>
                <Text style={styles.buttonText}>
                    Acessar
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#007bff",
        opacity: 0.7,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'MedulaOne_400Regular',
        fontWeight: "bold",
        marginBottom:20,
        color: "#fff"
    },
    img: {
        width: 150,
        height: 180,
    },
    box: {
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
    },
    text: {
        fontSize: 16,
        fontFamily: 'MedulaOne_400Regular',
        fontWeight: "bold",
        color: "black",
        opacity: 0.7,
        lineHeight: 22,
    },
    button: {
        width: "90%",
        backgroundColor: "green",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: 'MedulaOne_400Regular',
        fontWeight: "bold",
    }
})