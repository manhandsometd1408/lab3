import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Booking from './Booking';

const Stack = createStackNavigator();

const DetailsScreen = ({ route, navigation }) => {
    const { service } = route.params;

    const handleBooking = () => {
        navigation.navigate('Booking', {
            serviceName: service.service,
            prices: service.prices,
            imageUrl: service.imageUrl,
        });
    };
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VND';
    };
    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <View style={styles.containerWrapper}>
                {service.imageUrl && (
                    <Image source={{ uri: service.imageUrl }} style={styles.image} />
                )}

                <View style={styles.section}>
                    <Text style={styles.label}>Tên dịch vụ:</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.input}>{service.service}</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Giá:</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.input}>{formatPrice(service.prices)}</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={handleBooking}>
                <Text style={styles.buttonText}>Đặt Lịch</Text>
            </TouchableOpacity>
        </View>
    );
};

const Details = ({ route }) => {
    return (
        // <NavigationContainer independent={true}>
        <Stack.Navigator
            initialRouteName="Details"
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Details" component={DetailsScreen} initialParams={route.params} />
            <Stack.Screen name="Booking" component={Booking} options={{ title: 'Booking' }} />
        </Stack.Navigator>
        // </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        padding: 20,
        backgroundColor: 'white'
    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    backButton: {
        justifyContent: 'center',
    },
    containerWrapper: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 10,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    inputContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 5,
        padding: 5,
        marginLeft: 10,
    },
    input: {
        padding: 10,
        fontSize: 16,
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 20,
        borderRadius: 10,
    },
    addButton: {
        backgroundColor: 'black',
        borderRadius: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Details;
