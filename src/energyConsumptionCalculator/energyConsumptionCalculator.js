import { DBService } from './DBService.js'
import { DateTime } from 'luxon';

const dsService = new DBService()

async function calculate(sensorId, calcType, startDate, endDate) {
    console.log('=================================')
    console.log('SensorId:', sensorId)
    console.log('StartDate:', startDate)
    console.log('EndDate:', endDate)
    console.log('CalculationType:', calcType)
    console.log('=================================')
    
    const channel = (calcType === 'daily') ? 'dailyConsumption' : 'monthlyConsumption';

    const filterOptionsForSelect = {
        sensorId: sensorId,
        channel: 'energy',
        startDate: startDate,
        endDate: endDate
    }

    const dailyReading = await dsService.getAggReading(calcType, filterOptionsForSelect)

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
            channel: channel,
            value: dailyConsumption.consumed,
            time: dailyConsumption.day
        })
    })

    const filterOptionsForDelete = {
        sensorId: sensorId,
        channel: channel,
        startDate: startDate,
        endDate: endDate
    }

    // Delete old data if already present
    await dsService.deleteData(filterOptionsForDelete)

    // Insert new data
    await dsService.insertData(dataToInsert)
}

const calculateDailyEnergyConsumption = async function(days) {
    dsService.connect()

    try {
        const nowInChisinau = DateTime.now().setZone('Europe/Chisinau');
        const startDate = nowInChisinau.minus({ days: days }).startOf('day').toJSDate();
        const endDate = nowInChisinau.endOf('day').toJSDate();
        
        await calculate('D1MiniProEnergyMeterV1', 'daily', startDate, endDate)
        await calculate('ESP01EnergyMeterV2', 'daily', startDate, endDate)

    } finally {
        await dsService.disconnect()
    }
}

const calculateMontlyEnergyConsumption = async function(months) {
    dsService.connect()

    try {
        const nowInChisinau = DateTime.now().setZone('Europe/Chisinau');
        const startDate = nowInChisinau.minus({ months: months }).startOf('day').toJSDate();
        const endDate = nowInChisinau.endOf('day').toJSDate();
        
        await calculate('D1MiniProEnergyMeterV1', 'monthly', startDate, endDate)
        await calculate('ESP01EnergyMeterV2', 'monthly', startDate, endDate)

    } finally {
        await dsService.disconnect()
    }
}

//main();

export {
    calculateDailyEnergyConsumption,
    calculateMontlyEnergyConsumption
}