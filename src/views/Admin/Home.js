import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AddNewServices from './AddNewServices';
import ServiceDetails from './ServiceDetails';
import Profile from './Profile';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from './Header';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const servicesSnapshot = await firestore().collection('services').get();
                const servicesData = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setServices(servicesData);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchServices();

        const unsubscribe = navigation.addListener('focus', () => {
            fetchServices();
        });

        return unsubscribe;
    }, [navigation]);

    const handleServicePress = (service) => {
        navigation.navigate('ServiceDetails', { service });
    };

    const formatPrice = (price) => {
        const priceNumber = Number(price);
        return priceNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VND';
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleServicePress(item)}>
            <View style={styles.itemContainer}>
                <Text style={styles.itemText}>{`${index + 1}. ${item.service}`}</Text>
                <Text style={styles.itemText}>{formatPrice(item.prices)}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Header navigation={navigation} />
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>DANH SÁCH DỊCH VỤ</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddNewServices')}>
                        <Icon name="plus" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={services}
                    renderItem={renderItem}
                    keyExtractor={item => String(item.id)}
                    style={styles.list}
                />
            </View>
        </View>
    );
};

const Home = ({ route }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                initialParams={route.params}
            />

            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="AddNewServices" component={AddNewServices} />
            <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    card: {
        backgroundColor: 'pink',
        borderRadius: 30,
        padding: 15,
        marginBottom: 15,
        shadowColor: 'pink',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemText: {
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: 'pink',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
    },
    list: {},
});

export default Home;
