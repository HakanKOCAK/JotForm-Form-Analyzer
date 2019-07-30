import React, { Component } from 'react'
import { View, TextInput, Text, StyleSheet, Alert, Button, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import login from '../apis/Login'

const styles = StyleSheet.create({
    Login: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    LoginContainer: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        width: 300
    },

    LoginQuestions: {
        marginRight: 5,
        width: 80,
    },

    LoginInput: {
        display: 'flex',
        flexWrap: 'wrap',
        width: 170,
        padding: 3,
        borderColor: 'black',
        borderRadius: 3,
        borderWidth: 0.5
    },
    LoginButton: {
        marginTop: 7
    }
})
class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: ""
        }

        this.handleChange = this.handleChange.bind(this)
        this.handlePress = this.handlePress.bind(this)
    }

    async handlePress() {
        if (this.state.username === "") {
            Alert.alert("Please Enter the Username")
        } else if (this.state.password === "") {
            Alert.alert("Please Enter the Password")
        } else {
            let response = await login.getUser(this.state.username, this.state.password)
            if (response) {
                this.setState({
                    username: "",
                    password: ""
                })
                this.props.navigation.navigate('App')
            } else {
                Alert.alert("Please Check Your Credentials")
            }
        }
    }

    handleChange(evt, name) {
        this.setState({
            [name]: evt.nativeEvent.text
        })
    }
    render() {
        return (
            <View style={styles.Login}>
                <View style={styles.LoginContainer}>
                    <Text style={styles.LoginQuestions}>Username:</Text>
                    <TextInput
                        style={styles.LoginInput}
                        placeholder="example"
                        value={this.state.username}
                        onChange={(evt) => this.handleChange(evt, 'username')}>
                    </TextInput>
                </View>
                <View style={styles.LoginContainer}>
                    <Text style={styles.LoginQuestions}>Password:</Text>
                    <TextInput
                        style={styles.LoginInput}
                        secureTextEntry={true}
                        value={this.state.password}
                        onChange={(evt) => this.handleChange(evt, 'password')}>
                    </TextInput>
                </View>
                <TouchableOpacity>
                    <AntDesign name="login" size={32} style={styles.LoginButton} onPress={this.handlePress} />
                </TouchableOpacity>
            </View>
        )
    }
}

export default Login