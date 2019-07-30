import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import {
    LineChart,
    PieChart
} from 'react-native-chart-kit'

const screenWidth = Dimensions.get('window').width
const chartConfig = {
    backgroundGradientFrom: '#c66e74',
    backgroundGradientTo: '#ee9493',
    color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
    strokeWidth: 3,
    decimalPlaces: 1
}

class Line extends Component {
    getMonthName(data) {
        switch (data) {
            case '01':
                return 'Jan'
            case '02':
                return 'Feb'
            case '03':
                return 'Mar'
            case '04':
                return 'Apr'
            case '05':
                return 'May'
            case '06':
                return 'Jun'
            case '07':
                return 'Jul'
            case '08':
                return 'Aug'
            case '09':
                return 'Sep'
            case '10':
                return 'Oct'
            case '11':
                return 'Nov'
            case '12':
                return 'Dec'
            default: return null
        }
    }
    render() {
        let totals = []
        let labelDate = []
        if (this.props.total !== null) {
            totals = Object.values(this.props.total)
            if (this.props.filterType === 'year') {
                this.props.labels.map(item => {
                    labelDate.push(this.getMonthName(item.slice(3, 5)))
                })
            } else {
                labelDate = this.props.labels
            }
        }


        const data = {
            labels: labelDate,
            fontSize: 2,
            datasets: [{
                data: totals,
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,   // optional
                strokeWidth: 2 // optional
            }]
        }
        return (
            <LineChart
                data={data}
                width={screenWidth * 0.95}
                yAxisLabel={'$'}
                height={220}
                chartConfig={chartConfig}
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
            />
        )
    }
}
class Pie extends Component {
    getColors() {
        return [
            "#62C6CE",
            "#FAB1A0",
            "#DFC9E2"
        ]
    }
    render() {

        const colors = this.getColors()
        let forms = []
        this.props.forms.map((item, i) => {
            forms.push({ name: item.title, population: item.total, color: colors[i], legendFontColor: 'black', legendFontSize: 9 })
        })
        const data = forms
        return (
            <PieChart
                data={data}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
            />
        )
    }
}
export { Line, Pie }