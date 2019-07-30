import axios from 'axios'
import { Alert } from 'react-native'

const login = {

    getUser: async function (username, password) {
        try {
            const userdata = `username=${username}&password=${password}`
            let response = await axios.post(`https://api.jotform.com/user/login`, userdata)
            if (response.data['responseCode'] === 200) {
                return true
            }
        }
        catch (err) {
            return false
        }

    }

}

export default login