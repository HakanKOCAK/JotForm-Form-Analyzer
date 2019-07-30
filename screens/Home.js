import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { Line, Pie } from '../charts/Charts'
import getForms from '../apis/getForms'
import Submissions from '../apis/getFormSubmissions'
import Loading from './Loading'
import { CheckBox } from 'react-native-elements'

const styles = StyleSheet.create({
    chartContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    chartContainerItem: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 5
    },
    totalInfo: {
        display: 'flex',
        flexDirection: 'row',
        padding: 10
    },
    totalInfoItem: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: 'lightgrey',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    totalInfoItemTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#a1a1a1',
        marginBottom: 10
    },
    totalInfoItemInfo: {
        fontSize: 23
    }
})

class Home extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Home',
            headerRight: (
                <TouchableOpacity>
                    <AntDesign
                        name="logout"
                        size={30}
                        style={{ marginRight: 5 }}
                        onPress={() => navigation.navigate('Login')}
                    />
                </TouchableOpacity>
            ),
        }
    };
    constructor(props) {
        super(props)
        this.state = {
            chartType: 'Line',
            isLoading: true,
            filterType: 'year'
        }
        this.handlePress = this.handlePress.bind(this)
        this.setFilterType = this.setFilterType.bind(this)
        this.getFilteredData = this.getFilteredData.bind(this)
    }

    async getAllSubmissions(data) {
        let forms = []
        let submissions = []
        await Promise.all(data.map(async item => {
            await Submissions.getFormSubmissions(item.id).then(res => {
                if (Object.keys(res).length !== 0) {
                    let form
                    let total = 0
                    let submission
                    Object.values(res).map(item => {
                        total += parseFloat(item.total.split(" ")[0])
                        submission = { "date": item.date.date, "total": item.total.split(" ")[0] }
                        submissions.push(submission)
                    })
                    form = { ...form, "title": item.title, "total": total }
                    forms.push(form)
                }
            })
        }))

        this.setState({
            initialSubmissions: submissions,
            forms: forms,
            isLoading: false
        })
        this.getFilteredData("year")
    }
    componentDidMount() {
        getForms.getForms().then(res => {
            let forms = []
            res.map(item => {
                forms.push({ "id": item.id, "title": item.title })
            })
            this.getAllSubmissions(forms)
        })
    }
    handlePress(type) {
        this.setState({
            chartType: type
        })
    }

    async setFilterType(data) {
        await this.setState({
            filterType: data
        })
        this.getFilteredData()
    }
    async getFilteredData() {
        let dates = []
        let total = {}
        let filter

        if (this.state.filterType === 'year') {
            let i = 1
            while (i <= 12) {
                let startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                let toPush = new Date(startDate.setMonth(startDate.getMonth() + i)).toISOString().slice(2, 7)
                dates.push(toPush)
                total = { ...total, [toPush]: 0 }
                i += 1
            }

            await Promise.all(this.state.initialSubmissions.map(item => {
                if (new Date(item.date) >= new Date(new Date().setFullYear(new Date().getFullYear() - 1))) {
                    let date = item.date.slice(2, 4) + "-" + item.date.slice(5, 7)
                    total[date] = total[date] + parseFloat(item.total)
                }
            }))

            filter = 'year'
        } else {
            let i = 6
            while (i >= 0) {
                let startDate = new Date(new Date().setDate(new Date().getDate() - i))
                let toCalcDay = startDate.toJSON().slice(0, 10)
                let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                let d = new Date(toCalcDay);
                let dayName = days[d.getDay()].slice(0, 3);
                dates.push(dayName)
                total = { ...total, [toCalcDay]: 0 }
                i -= 1
            }

            await Promise.all(this.state.initialSubmissions.map(item => {
                if (new Date(item.date) >= new Date(new Date().setDate(new Date().getDate() - 6))) {
                    total[item.date] = total[item.date] + parseFloat(item.total)
                }
            }))

            filter = 'week'
        }

        this.setState({
            lineFilter: filter,
            filteredDate: dates,
            filteredTotal: total
        })
    }
    render() {
        if (!this.state.isLoading) {
            let total = 0
            this.state.forms.map(item => {
                total += parseFloat(item.total)
            })
            return (
                <View>
                    <View style={styles.totalInfo}>
                        <View style={styles.totalInfoItem}>
                            <Text style={styles.totalInfoItemTitle}>Total Submissions </Text>
                            <Text style={styles.totalInfoItemInfo}>{this.state.initialSubmissions.length}</Text>
                        </View>
                        <View style={styles.totalInfoItem}>
                            <Text style={styles.totalInfoItemTitle}>Total Payment </Text>
                            <Text style={styles.totalInfoItemInfo}>{total}$</Text>
                        </View>
                    </View>
                    <View style={styles.chartContainer}>
                        <View style={styles.chartContainerItem}>
                            <Text>Percentage of each Form Payments to Total</Text>
                            <Pie forms={this.state.forms} />
                        </View>
                        <View style={styles.chartContainerItem}>
                            <View style={{ flexDirection: 'row' }}>
                                <CheckBox
                                    title="Last Year"
                                    checkedColor='green'
                                    checked={this.state.filterType === "year"}
                                    onPress={() => this.setFilterType("year")}
                                />
                                <CheckBox
                                    title="Last Week"
                                    checkedColor='green'
                                    checked={this.state.filterType === "week"}
                                    onPress={() => this.setFilterType("week")}
                                />
                            </View>

                            <Line
                                filterType={this.state.lineFilter !== undefined ? this.state.lineFilter : null}
                                labels={this.state.filteredDate !== undefined ? this.state.filteredDate : null}
                                total={this.state.filteredTotal !== undefined ? this.state.filteredTotal : null}
                            />
                        </View>
                    </View>

                </View>
            )
        } else {
            return <Loading />
        }
    }
}

export default Home