import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import HeaderCustomer from './HeaderCustomer';
import Icon from 'react-native-vector-icons/FontAwesome';
const AppointmentCustomer = () => {
    const navigation = useNavigation();
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const unsubscribe = firestore().collection('bookings').onSnapshot(querySnapshot => {
            const bookingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBookings(bookingsData);
        });

        return () => unsubscribe();
    }, []);

    const deleteBooking = async (id) => {
        try {
            await firestore().collection('bookings').doc(id).delete();
            Alert.alert('Thông báo', 'Đặt lịch đã được xoá thành công');
        } catch (error) {
            console.error('Error deleting booking: ', error);
            Alert.alert('Error', 'Failed to delete booking');
        }
    };

    return (
        <View style={styles.container}>
            <HeaderCustomer />
            <View style={styles.content}>
                <Text style={styles.title}>Các dịch vụ đã đặt của bạn</Text>
                <FlatList
                    style={styles.list}
                    data={bookings}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <View style={styles.card}>

                            <View style={styles.cardContent}>
                                <Text style={styles.serialNumber}>{index + 1}.</Text>
                                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                                <View style={styles.textContainer}>
                                    <Text style={styles.bookingText}>Tên dịch vụ: {item.serviceName}</Text>
                                    <Text style={styles.bookingText}>Ngày: {item.bookingDate}</Text>
                                    <Text style={styles.bookingText}>Giờ: {item.bookingTime}</Text>
                                </View>
                                <TouchableOpacity onPress={() => deleteBooking(item.id)} style={styles.deleteButton}>
                                    <Icon name="trash" size={30} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        marginTop: 20
    },
    list: {
        width: '100%',
    },
    content: {
        padding: 20
    },
    card: {
        backgroundColor: '#87cefa',
        borderRadius: 30,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    bookingText: {
        fontSize: 16,
        marginBottom: 5,
    },
    deleteButton: {
        backgroundColor: 'red',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 5,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    serialNumber: {
        fontWeight: 'bold',
        marginRight: 10,
    },
});

export default AppointmentCustomer;
