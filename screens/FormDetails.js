import React, { Component } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Line } from '../charts/Charts'
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import Submissions from '../apis/getFormSubmissions'
import Loading from './Loading'
import { CheckBox } from 'react-native-elements'

const styles = StyleSheet.create({
    typeBar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    typeBarItems: {
        borderWidth: 0.5,
        padding: 10,
        marginBottom: 15
    },
    chartContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }, listItem: {
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
        fontSize: 16,
        marginBottom: 20
    },
    itemDate: {
        fontSize: 12,
        color: 'grey'
    },
    paymentInfo: {
        display: 'flex',
        flexDirection: 'column',
        padding: 8,
        marginBottom: 10
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
    },
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
})

class FormDetails extends Component {
    static navigationOptions = {
        headerTitle: "Details"
    }
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            display: 'Charts',
            graphFilterType: 'year'
        }
        this.handlePress = this.handlePress.bind(this)
    }

    handlePress(type) {
        this.setState({
            display: type
        })
    }

    async setFilterType(data) {
        await this.setState({
            graphFilterType: data
        })
        if (this.state.submissions !== undefined) {
            this.getFilteredData()
        }
    }
    async getSubmissions() {
        await Submissions.getFormSubmissions(this.props.navigation.state.params).then(data => {
            let total = 0
            let count = 0

            Object.values(data).map(item => {
                let tot = item.total
                JSON.stringify(tot)
                total += parseFloat(tot.split(" ")[0])
                count++
            })

            this.setState({
                submissions: count > 0 ? data : undefined,
                totalPaymentCount: count,
                totalAmount: `${total} $`,
                isLoading: false
            })
        })
        if (this.state.submissions !== undefined) {
            this.getFilteredData()
        }
    }

    componentDidMount() {
        this.getSubmissions()
    }

    async getFilteredData() {

        let dates = []
        let total = {}
        let filter

        if (this.state.graphFilterType === 'year') {
            let i = 1
            while (i <= 12) {
                let startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                let toPush = new Date(startDate.setMonth(startDate.getMonth() + i)).toISOString().slice(2, 7)
                dates.push(toPush)
                total = { ...total, [toPush]: 0 }
                i += 1
            }

            await Promise.all(Object.values(this.state.submissions).map(item => {
                if (new Date(item.date.date) >= new Date(new Date().setFullYear(new Date().getFullYear() - 1))) {
                    let date = item.date.date.slice(2, 4) + "-" + item.date.date.slice(5, 7)
                    total[date] = total[date] + parseFloat(item.total.split(" ")[0])
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
            await Promise.all(Object.values(this.state.submissions).map(item => {
                if (new Date(item.date.date) >= new Date(new Date().setDate(new Date().getDate() - 6))) {
                    total[item.date.date] = total[item.date.date] + parseFloat(item.total.split(" ")[0])
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
            let toDisplay
            if (this.state.submissions === undefined) {
                toDisplay = toDisplay = <Text>You dont have any submission for this form.</Text>
            } else if (this.state.display === 'Charts') {
                toDisplay = (
                    <View style={styles.chartContainer}>
                        <View style={styles.chartContainerItem}>
                            <View style={{ flexDirection: 'row' }}>
                                <CheckBox
                                    title="Last Year"
                                    checkedColor='green'
                                    checked={this.state.graphFilterType === "year"}
                                    onPress={() => this.setFilterType("year")}
                                />
                                <CheckBox
                                    title="Last Week"
                                    checkedColor='green'
                                    checked={this.state.graphFilterType === "week"}
                                    onPress={() => this.setFilterType("week")}
                                />
                            </View>
                            <Line
                                filterType={this.state.lineFilter !== undefined ? this.state.lineFilter : null}
                                labels={this.state.filteredDate !== undefined ? this.state.filteredDate : null}
                                total={this.state.filteredTotal !== undefined ? this.state.filteredTotal : null} />
                        </View>
                    </View>)
            } else {
                toDisplay = Object.values(this.state.submissions).map((item, i) => {
                    return (
                        <View style={styles.listItem} key={i} >
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemTitle}>
                                    {i + 1}. {item.product}
                                </Text>
                                <Text style={styles.itemTitle}>
                                    Total: {item.total}
                                </Text>
                                <Text style={styles.itemDate}>
                                    Submitted at: {item.date.date.split("-").reverse().join("/")}
                                </Text>
                            </View>
                        </View>
                    )
                })
            }
            return (
                <ScrollView>
                    <View style={styles.totalInfo}>
                        <View style={styles.totalInfoItem}>
                            <Text style={styles.totalInfoItemTitle}>Total Submissions</Text>
                            <Text style={styles.totalInfoItemInfo}>{this.state.totalPaymentCount}</Text>
                        </View>
                        <View style={styles.totalInfoItem}>
                            <Text style={styles.totalInfoItemTitle}>Total Payment</Text>
                            <Text style={styles.totalInfoItemInfo}>{this.state.totalAmount}</Text>
                        </View>

                    </View>
                    <View style={styles.typeBar}>
                        <TouchableOpacity>
                            <AntDesign
                                name='linechart'
                                size={30}
                                style={styles.typeBarItems}
                                color={this.state.display === 'Charts' ? 'blue' : null}
                                onPress={() => this.handlePress('Charts')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <FontAwesome
                                name='history'
                                size={33}
                                style={styles.typeBarItems}
                                color={this.state.display === 'History' ? 'blue' : null}
                                onPress={() => this.handlePress('History')}
                            />
                        </TouchableOpacity>
                    </View >
                    <View style={styles.chartContainer}>
                        {toDisplay}
                    </View>

                </ScrollView>
            )
        } else {
            return <Loading />
        }
    }
}

export default FormDetails