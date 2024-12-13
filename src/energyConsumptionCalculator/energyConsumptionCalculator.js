import {DBService} from './DBService.js'

const dsService = new DBService()

async function calculate(sensorId, daysBack) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)
    startDate.setUTCHours(0, 0, 0, 0)

    const endDate = new Date()
    endDate.setUTCHours(23, 59, 59, 999)

    console.log('=================================')
    console.log('SensorId:', sensorId)
    console.log('StartDate:', startDate)
    console.log('EndDate:', endDate)
    console.log('Days back:', daysBack)
    console.log('=================================')

    const filterOptionsForSelect = {
        sensorId: sensorId,
        channel: 'energy',
        startDate: startDate,
        endDate: endDate
    }

    const dailyReading = await dsService.getDailyReading(filterOptionsForSelect)

    let lastDayReading = null
    let calculatedDailyConsumption = []

    dailyReading.forEach(reading => {
        if (lastDayReading !== null) {
            calculatedDailyConsumption.push({
                day: lastDayReading.day,
                consumed: reading.first_reading - lastDayReading.first_reading
            })
        }

        lastDayReading = reading
    })

    let dataToInsert = []
    calculatedDailyConsumption.forEach(dailyConsumption => {
        dataToInsert.push({
            sensor: sensorId,
            channel: 'dailyConsumption',
            value: dailyConsumption.consumed,
            time: dailyConsumption.day
        })
    })

    const filterOptionsForDelete = {
        sensorId: sensorId,
        channel: 'dailyConsumption',
        startDate: startDate,
        endDate: endDate
    }

    // Delete old data if already present
    await dsService.deleteData(filterOptionsForDelete)

    // Insert new data
    await dsService.insertData(dataToInsert)
}

const calculateForDaysBack = async function(days) {
    dsService.connect()

    try {
        await calculate('D1MiniProEnergyMeterV1', days)
        await calculate('ESP01EnergyMeterV2', days)

    } finally {
        await dsService.disconnect()
    }
}

//main();

export {
    calculateForDaysBack
}