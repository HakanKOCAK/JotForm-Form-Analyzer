import axios from 'axios'
import { Alert } from 'react-native'
import helpers from '../helpers/helpers'

const helper = {
    // apiKey: {api key},

    getAllForms: async function () {
        try {
            const filter = JSON.stringify({
                status: 'ENABLED'
            });
            const arr = [];

            const res = await axios.get(`https://api.jotform.com/user/forms?apiKey=${this.apiKey}&limit=1000&filter=${filter}`);

            await Promise.all(res.data.content.map(async item => {
                if (item.id !== "91630860146960") {
                    await axios.get(`https://api.jotform.com/form/${item.id}/questions?apiKey=${this.apiKey}`).then(res => {
                        Object.keys(res.data.content).map(i => {
                            const data = res.data.content[i]
                            if (helpers.getPaymentTypes().indexOf(data.type) !== -1) {
                                const obj = { "id": item.id, "type": data.type, "reason": data.paymentType }
                                arr.push(obj);
                            }
                        })
                    });
                }
            }))

            return arr
        } catch (err) {
            console.log(err)
            Alert.alert("Cannot Fetch the Forms")

        }
    },
    getForms: async function () {
        let arr = []
        let res = await this.getAllForms()
        await Promise.all(res.map(async item => {
            await axios.get(`https://api.jotform.com/form/${item.id}?apiKey=${this.apiKey}`).then(res => {
                let data = res.data.content
                data = { ...data, "type": item.type, "reason": item.reason }
                arr.push(data)
            })
        }))

        return arr
    }
}

export default helper