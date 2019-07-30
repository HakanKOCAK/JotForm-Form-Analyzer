import { createStackNavigator, createAppContainer } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation';
import { AntDesign } from '@expo/vector-icons'
import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import Home from '../screens/Home'
import Forms from '../screens/Forms'
import Login from '../screens/Login'
import FormDetails from '../screens/FormDetails'
import { createSwitchNavigator } from 'react-navigation';

const HomeTab = createStackNavigator({ Home }, {
    navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
            return <AntDesign name='home' size={30} style={{ marginTop: 5, marginBottom: 5 }} color={tintColor} />
        }
    },
})
const FormsTab = createStackNavigator(
    {
        Forms: {
            screen: Forms
        },
        FormDetails: {
            screen: FormDetails
        },
    },
    {
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => {
                return <FontAwesome name='list' size={30} style={{ marginTop: 5, marginBottom: 5 }} color={tintColor} />
            }
        },
    })
const BottomNav = createBottomTabNavigator(
    {
        HomeTab,
        FormsTab
    },
    {
        tabBarOptions: {
            showLabel: false,
        }
    }
);

const AppNavigator = createSwitchNavigator({
    Login: {
        screen: Login,
        navigationOptions: {
            headerTitle: 'Login'
        }
    },

    App: {
        screen: BottomNav
    }
})
export default createAppContainer(AppNavigator);