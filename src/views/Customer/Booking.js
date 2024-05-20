import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';

const Booking = ({ route }) => {
    const navigation = useNavigation();
    const { serviceName, prices, imageUrl } = route.params;
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');

    const handleSaveBooking = async () => {
        if (!bookingDate.trim() || !bookingTime.trim()) { // Kiểm tra xem thông tin ngày/tháng/năm và thời gian có được nhập không
            Alert.alert('Lỗi', 'Vui lòng nhập cả ngày/tháng/năm và thời gian');
            return;
        }

        try {
            // Convert bookingDate to YYYY-MM-DD format before saving to Firestore
            const formattedDate = formatBookingDate(bookingDate);
            await firestore().collection('bookings').add({
                serviceName,
                prices,
                imageUrl,
                bookingDate: formattedDate,
                bookingTime,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
            Alert.alert('Thông báo', 'Đặt lịch thành công');
            navigation.navigate('HomeCustomer');
        } catch (error) {
            Alert.alert('Error', 'Failed to save booking');
        }
    };

    const formatBookingDate = (date) => {
        const [day, month, year] = date.split('-');
        return `${year}-${month}-${day}`;
    };
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VND';
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.text}>Service Name: {serviceName}</Text>
            <Text style={styles.text}>Prices: {formatPrice(prices)}</Text>
            {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}

            <TextInput
                style={styles.input}
                placeholder="Nhập MM/dd/yyyy"
                value={bookingDate}
                onChangeText={setBookingDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Nhập thời gian"
                value={bookingTime}
                onChangeText={setBookingTime}
            />

            <TouchableOpacity style={styles.addButton} onPress={handleSaveBooking}>
                <Text style={styles.buttonText}>Đặt Lịch</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 20,
        borderRadius: 10
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginTop: 20,
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    addButton: {
        backgroundColor: 'black',
        borderRadius: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: 200,
        height: 35,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Booking;
