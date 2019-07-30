import React, { Component } from 'react'
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from 'react-native'

export default class Loading extends Component {
    render() {
        return (
            <View style={[styles.container]}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
})