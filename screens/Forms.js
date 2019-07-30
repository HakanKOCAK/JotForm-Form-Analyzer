import React, { Component } from 'react'
import { View, Text, StyleSheet, Picker, Alert } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { CheckBox } from 'react-native-elements'
import getForms from '../apis/getForms'
import { ScrollView, TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import Loading from './Loading'

const styles = StyleSheet.create({
    listItem: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 3,
        borderWidth: 0.5,
        borderColor: 'grey',
        flexWrap: 'wrap'
    },
    itemInfo: {
        padding: 5,
        flexGrow: 2,
    },
    itemTitle: {
        fontSize: 20,
        marginBottom: 20
    },
    itemDate: {
        fontSize: 12,
        color: 'grey'
    },
    itemDetail: {
        fontSize: 30,
        fontWeight: '100'
    },
    dateInput: {
        borderWidth: 0.5,
        borderRadius: 2,
        borderColor: 'grey',
        width: 150,
        height: 30,
        marginLeft: 10,
        padding: 5
    },
    filterButton: {
        borderWidth: 0.5,
        borderRadius: 2,
        width: 150,
        height: 30,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 5,
        backgroundColor: 'lightgrey',
    }
})

class Forms extends Component {
    static navigationOptions = {
        headerTitle: 'Forms',
    }

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            forms: [],
            isFiltering: false,
            paymentFilter: 'all',
            filterType: 'date',
            reasonFilter: 'all'
        }
        this.setFilterType = this.setFilterType.bind(this)
        this.handleFilter = this.handleFilter.bind(this)
        this.isMatched = this.isMatched.bind(this)
        this.handlePressFilter = this.handlePressFilter.bind(this)
        this.updatePaymentFilter = this.updatePaymentFilter.bind(this)
        this.updateReasonFilter = this.updateReasonFilter.bind(this)
        this.checkPaymentTypes = this.checkPaymentTypes.bind(this)
        this.checkReasonTypes = this.checkReasonTypes.bind(this)
        this.checkDates = this.checkDates.bind(this)
    }

    getDetails = (id) => {
        this.props.navigation.navigate('FormDetails', id)
    }

    async getForms() {
        let arr = []
        let res = await getForms.getForms()

        await Promise.all(res.map(form => {
            let date = form.created_at.split(" ")[0]
            let formDetail = { "id": form.id, "title": form.title, "date": date, "type": form.type, "reason": form.reason }
            arr.push(formDetail)
        }))

        this.setState({
            forms: arr,
            isLoading: false,
            initialState: arr
        })
    }

    componentDidMount() {
        this.getForms()
    }

    async isMatched(start, end) {

        start = new Date(start.split("/").reverse().join("-"))
        end = new Date(end.split("/").reverse().join("-"))

        if (end < start) {
            Alert.alert("Start Date exceeds End Date. Please check the dates")
        } else {
            let updatedList = this.state.initialState
            await Promise.all(updatedList = updatedList.filter(function (item) {
                const formDate = new Date(item.date.split("/").reverse().join("-"))
                if (start <= formDate && formDate <= end) {
                    return item
                }
            }))
            this.setState({ forms: updatedList })
        }

    }
    async checkReasonTypes() {
        let filter = this.state.reasonFilter
        if (filter === 'all') {
            this.setState({
                forms: this.state.initialState
            })
        } else {
            let filteredList = this.state.initialState
            await Promise.all(filteredList = filteredList.filter(function (item) {
                if (item.reason === filter) {
                    return item
                }
            }))
            this.setState({ forms: filteredList })
        }
    }
    async checkPaymentTypes() {
        let filter = this.state.paymentFilter
        if (filter === 'all') {
            this.setState({
                forms: this.state.initialState
            })
        } else {
            let filteredList = this.state.initialState
            await Promise.all(filteredList = filteredList.filter(function (item) {
                if (item.type === filter) {
                    return item
                }
            }))
            this.setState({ forms: filteredList })
        }
    }
    checkDates() {
        if (this.state.start === undefined) {
            Alert.alert("Please Enter a Start Date")
        } else {
            if (this.state.end === undefined) {
                if (this.state.start.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)) {
                    this.isMatched(this.state.start, new Date().toJSON().slice(0, 10).split('-').reverse().join('/'))
                } else {
                    Alert.alert("Please Enter the Date in Valid Format Example: 12/12/2012")
                }
            } else {
                if (this.state.end.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) && this.state.start.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)) {
                    this.isMatched(this.state.start, this.state.end)
                } else {
                    Alert.alert("Please Enter the Date in Valid Format Example: 12/12/2012")
                }
            }
        }
    }

    handlePressFilter() {
        this.setState({
            isFiltering: !this.state.isFiltering,
            end: undefined,
            start: undefined,
            forms: this.state.initialState
        })
    }

    handleFilter() {
        if (this.state.filterType === "date") {
            this.checkDates()
        } else if (this.state.filterType === 'payment') {
            this.checkPaymentTypes()
        } else {
            this.checkReasonTypes()
        }
    }

    handleChange(evt, name) {
        if (name === "end" && evt.nativeEvent.text === "") {
            this.setState({
                end: undefined
            })
        } else {
            this.setState({
                [name]: evt.nativeEvent.text
            })
        }

    }

    setFilterType(data) {
        if (data === 'date') {
            this.setState({
                paymentFilter: 'all',
                reasonFilter: 'all'
            })
        } else if (data === 'payment') {
            this.setState({
                end: undefined,
                start: undefined,
                forms: this.state.initialState,
                reasonFilter: 'all'
            })
        } else {
            this.setState({
                end: undefined,
                start: undefined,
                forms: this.state.initialState,
                paymentFilter: 'all'
            })
        }

        this.setState({
            filterType: data
        })
    }

    updatePaymentFilter(value) {
        this.setState({
            paymentFilter: value
        })
    }
    updateReasonFilter(value) {
        this.setState({
            reasonFilter: value
        })
    }

    render() {
        let filterBy
        if (this.state.filterType === "date") {
            filterBy = <View style={{ flexDirection: 'row', padding: 15 }}>
                <TextInput style={styles.dateInput} placeholder="From ex:(25/12/2019)" onChange={(evt) => this.handleChange(evt, 'start')} />
                <TextInput style={styles.dateInput} placeholder="To ex:(30/12/2019)" onChange={(evt) => this.handleChange(evt, 'end')} />
            </View>
        } else if (this.state.filterType === "payment") {
            let data = []
            let types = []
            this.state.initialState.map(item => {
                if (item.type.split("_")[1].toUpperCase() === 'PAYMENT') {
                    if (data.indexOf("PURCHASE ORDER") === -1) {
                        data.push("PURCHASE ORDER")
                        types.push(item.type)
                    }
                } else {
                    if (data.indexOf(item.type.split("_")[1].toUpperCase()) === -1) {
                        data.push(item.type.split("_")[1].toUpperCase())
                        types.push(item.type)
                    }
                }
            })
            filterBy = <Picker selectedValue={this.state.paymentFilter} onValueChange={this.updatePaymentFilter}>
                <Picker.Item key='all' label='ALL' value='all' />
                {data.map((item, i) =>
                    <Picker.Item
                        key={i}
                        label={item}
                        value={types[i]}
                    />
                )}
            </Picker>
        } else {
            let data = []
            let types = []
            this.state.initialState.map(item => {

                if (item.reason === 'product') {
                    if (data.indexOf('SELL PRODUCT') === -1) {
                        data.push("SELL PRODUCT")
                        types.push(item.reason)
                    }
                } else {
                    if (data.indexOf(item.reason.toUpperCase()) === -1) {
                        data.push(item.reason.toUpperCase())
                        types.push(item.reason)
                    }
                }
            })

            filterBy = <Picker selectedValue={this.state.reasonFilter} onValueChange={this.updateReasonFilter}>
                <Picker.Item key='all' label='ALL' value='all' />
                {data.map((item, i) =>
                    <Picker.Item
                        key={i}
                        label={item}
                        value={types[i]}
                    />
                )}
            </Picker>
        }

        let data = this.state.forms.map((item, i) => {
            return (
                <TouchableOpacity key={i} onPress={() => this.getDetails(item.id)}>
                    <View style={styles.listItem} key={i} >
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemTitle}>
                                {item.title}
                            </Text>
                            <Text style={styles.itemDate}>
                                Created at: {item.date.split("-").reverse().join("/")}
                            </Text>
                        </View>
                        <Text style={styles.itemDetail}>></Text>
                    </View>
                </TouchableOpacity>
            )
        })

        if (!this.state.isLoading) {
            return (
                <ScrollView >
                    <CheckBox
                        title="Filter Forms"
                        checkedColor='green'
                        checked={this.state.isFiltering}
                        onPress={this.handlePressFilter}
                    />
                    {this.state.isFiltering ?
                        <View style={{ flexDirection: 'column' }}>
                            <CheckBox
                                title="Filter by Date"
                                checkedColor='green'
                                checked={this.state.filterType === "date"}
                                onPress={() => this.setFilterType("date")}
                            />
                            <CheckBox
                                title="Filter by Payment Gateway"
                                checkedColor='green'
                                checked={this.state.filterType === "payment"}
                                onPress={() => this.setFilterType("payment")}
                            />
                            <CheckBox
                                title="Filter by Payment Type"
                                checkedColor='green'
                                checked={this.state.filterType === "reason"}
                                onPress={() => this.setFilterType("reason")}
                            />
                        </View> :
                        null
                    }
                    {this.state.filterType !== undefined && this.state.isFiltering ?
                        <View>
                            {filterBy}
                            <TouchableOpacity style={styles.filterButton} onPress={this.handleFilter}>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: 15
                                    }}
                                    name="filter"
                                >Filter</Text>
                            </TouchableOpacity>
                        </View> :
                        null
                    }
                    {data}
                </ScrollView>
            )
        } else {
            return <Loading />
        }

    }
}

export default Forms