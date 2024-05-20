import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileCustomer from './ProfileCustomer';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import Details from './Details';
import HeaderCustomer from './HeaderCustomer';

const Stack = createStackNavigator();

const HomeScreenCustomer = ({ navigation }) => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const servicesSnapshot = await firestore().collection('services').get();
                const servicesData = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setServices(servicesData);
                setFilteredServices(servicesData);
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

    useEffect(() => {
        if (searchQuery) {
            const filtered = services.filter(service =>
                service.service.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredServices(filtered);
        } else {
            setFilteredServices(services);
        }
    }, [searchQuery, services]);

    const handleServicePress = (service) => {
        navigation.navigate('Details', { service });
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VND';
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
            <HeaderCustomer navigation={navigation} />

            <TextInput
                style={styles.searchBar}
                placeholder="Tìm kiếm ..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>DANH SÁCH DỊCH VỤ</Text>
                </View>

                <FlatList
                    data={filteredServices}
                    renderItem={renderItem}
                    keyExtractor={item => String(item.id)}
                    style={styles.list}
                />
            </View>
        </View>
    );
};

const HomeCustomer = ({ route }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="HomeCustomer"
                component={HomeScreenCustomer}
                initialParams={route.params}
            />
            <Stack.Screen name="ProfileCustomer" component={ProfileCustomer} />
            <Stack.Screen name="Details" component={Details} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    searchBar: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 30,
        margin: 10,
        paddingLeft: 10,
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
    },
    headerText: {
        flex: 1,
        fontSize: 30,
        textAlign: 'center',
        color: 'black',
    },
    list: {
        paddingTop: 20,
    },
});

export default HomeCustomer;
