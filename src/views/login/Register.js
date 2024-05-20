import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function Register({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleRegister = async () => {
        if (!isValidEmail(email)) {
            Alert.alert('Email không hợp lệ', 'Vui lòng nhập địa chỉ email hợp lệ.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Mật khẩu không hợp lệ', 'Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        if (password !== repassword) {
            Alert.alert('Mật khẩu và mật khẩu nhập lại không khớp');
            return;
        }

        setLoading(true);

        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const { uid } = userCredential.user;

            await firestore().collection('user').doc(uid).set({
                email: email,
                name: name,
                password: password,
                role: 'user',
            });

            Alert.alert('Đăng ký thành công');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Lỗi đăng ký', error);
            Alert.alert('Đã có lỗi xảy ra khi đăng ký', error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleResetShowPassword = () => {
        setShowResetPassword(!showResetPassword);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.innerContainer}>
                    <Text style={styles.title}>Đăng Ký</Text>
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Địa chỉ email</Text>
                            <TextInput
                                autoCapitalize="none"
                                autoCorrect={false}
                                clearButtonMode="while-editing"
                                keyboardType="email-address"
                                onChangeText={setEmail}
                                placeholder="john@example.com"
                                placeholderTextColor="#6b7280"
                                style={styles.input}
                                value={email}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mật khẩu</Text>
                            <View style={styles.passwordInput}>
                                <TextInput
                                    autoCorrect={false}
                                    clearButtonMode="while-editing"
                                    onChangeText={setPassword}
                                    placeholder="********"
                                    placeholderTextColor="#6b7280"
                                    style={styles.input}
                                    secureTextEntry={!showPassword}
                                    value={password}
                                />
                                <TouchableOpacity onPress={toggleShowPassword} style={styles.passwordToggle}>
                                    <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nhập lại mật khẩu</Text>
                            <View style={styles.passwordInput}>
                                <TextInput
                                    autoCorrect={false}
                                    clearButtonMode="while-editing"
                                    onChangeText={setRepassword}
                                    placeholder="********"
                                    placeholderTextColor="#6b7280"
                                    style={styles.input}
                                    secureTextEntry={!showResetPassword}
                                    value={repassword}
                                />
                                <TouchableOpacity onPress={toggleResetShowPassword} style={styles.passwordToggle}>
                                    <Text style={styles.eyeIcon}>{showResetPassword ? '👁️' : '👁️'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Họ và tên</Text>
                            <TextInput
                                autoCapitalize="words"
                                autoCorrect={false}
                                clearButtonMode="while-editing"
                                onChangeText={setName}
                                placeholder="John Doe"
                                placeholderTextColor="#6b7280"
                                style={styles.input}
                                value={name}
                            />
                        </View>

                        <TouchableOpacity onPress={handleRegister} disabled={loading}>
                            <View style={styles.button}>
                                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Đăng ký</Text>}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading}>
                            <Text style={styles.goBackText}>Quay lại</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    innerContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 31,
        fontWeight: '700',
        color: '#FFC0CB',
        marginBottom: 24,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 17,
        fontWeight: '600',
        color: '#222',
        marginBottom: 8,
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
        borderWidth: 1,
        borderColor: '#C9D3DB',
    },
    passwordInput: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    passwordToggle: {
        position: 'absolute',
        right: 12,
        top: 12,
    },
    eyeIcon: {
        fontSize: 22,
        color: '#6b7280',
    },
    button: {
        marginTop: 10,
        backgroundColor: 'black',
        borderRadius: 30,
        paddingVertical: 12,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    goBackText: {
        marginTop: 5,
        fontSize: 16,
        color: 'blue',
        textAlign: 'center',
    },
});
