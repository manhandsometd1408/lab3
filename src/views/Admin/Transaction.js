import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Transaction = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Transaction Screen!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default Transaction;
