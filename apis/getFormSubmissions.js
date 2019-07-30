import axios from 'axios'

const Submissions = {
    // apiKey: {api key},

    getFormSubmissions: async function (formID) {
        let res = await axios.get(`https://api.jotform.com/form/${formID}/submissions?apiKey=${this.apiKey}`)

        const data = res.data.content
        let formSubmissions = {}
        data.map((item, i) => {
            let submission = {}

            // Date Information
            const str = item.created_at
            const fullDate = str.split(" ")
            const time = fullDate[1]
            const date = fullDate[0]
            const obj = { "date": date, "time": time }

            submission = { ...submission, "date": obj }
            const answers = item.answers
            Object.keys(answers).map(key => {
                let items = answers[key]
                if (items.name === "heading") {
                    formName = items.text
                }
                else if (items.answer != undefined) {
                    let ans = items.answer
                    let productDetails = JSON.parse(ans["paymentArray"])
                    //Product details
                    let product = productDetails.product[0]
                    //Total Paymenbt
                    let total = `${productDetails.total} ${productDetails.currency}`

                    submission = { ...submission, "product": product, "total": total }
                }
            })

            formSubmissions = { ...formSubmissions, [i]: submission }
        })
        return formSubmissions
    }
}

export default Submissions