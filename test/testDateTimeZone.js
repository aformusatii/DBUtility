import { DateTime } from 'luxon';

function getDayPeriodForChisinau() {
    const nowInChisinau = DateTime.now().setZone('Europe/Chisinau');

    // Subtract the number of days from the start of the day
    const startDate = nowInChisinau.minus({ months: 5 }).startOf('day').toJSDate();
    
    const endDate = nowInChisinau.endOf('day').toJSDate();
    console.log(startDate, endDate);
}

getDayPeriodForChisinau();