import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Header from './Header';
const Customer = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const snapshot = await firestore().collection('bookings').get();
                const bookingsData = snapshot.docs.map(doc => doc.data());
                setBookings(bookingsData);
            } catch (error) {
                console.error('Error fetching bookings: ', error);
            }
        };

        fetchBookings();
    }, []);

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.list}>
                <Text style={styles.title}>LỊCH ĐẶT KHÁCH HÀNG</Text>
                <FlatList
                    data={bookings}
                    renderItem={({ item, index }) => (
                        <View style={styles.card}>
                            <Text style={styles.serialNumber}>{index + 1}.</Text>
                            <View style={styles.itemContent}>
                                <View style={{ justifyContent: 'center', alignContent: 'center' }}>
                                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                                </View>
                                <View style={{ marginLeft: 15 }}>
                                    <Text style={styles.bookingText}>Tên dịch vụ: {item.serviceName}</Text>
                                    <Text style={styles.bookingText}>Giá: {item.prices}</Text>
                                    <Text style={styles.bookingText}>Ngày làm dịch vụ: {item.bookingDate}</Text>
                                    <Text style={styles.bookingText}>Thời gian: {item.bookingTime}</Text>
                                </View>

                            </View>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>

        </View>
    );
}

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
    },
    list: {
        padding: 20
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 15,
        borderRadius: 30,
        backgroundColor: 'pink',
        shadowColor: 'pink',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    serialNumber: {
        marginRight: 10,
        fontWeight: 'bold',
    },
    itemContent: {
        flexDirection: 'row',
        flex: 1,


    },
    bookingText: {
        fontSize: 16,
        marginBottom: 5,
    },
    image: {
        width: 80,
        height: 80,
        marginBottom: 10,
        borderRadius: 10,
    },
});

export default Customer;
