import React from 'react';
import { NavigationProps } from '../types/RootStackParamList';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Logo from '../assets/olympicsLogo.png'

export default function Home({ navigation }: NavigationProps<"Feed">) {

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Olympic Notify
            </Text>
            <Image src={Logo} style={styles.img} />
            <View style={styles.box}>
                <Text style={styles.text}>
                    Com esse aplicativo você:
                </Text>
                <Text style={styles.text}>
                    ✅ recebe notificação dos seus jogos favoritos
                </Text>
                <Text style={styles.text}>
                    ✅ acompanha o placar dos jogos ao vivo
                </Text>
                <Text style={styles.text}>
                    ✅ tem acesso as informações dos jogadores das equipes
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
        backgroundColor: "#fff",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'MedulaOne_400Regular',
        fontWeight: "bold",
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
        backgroundColor: "#007bff",
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