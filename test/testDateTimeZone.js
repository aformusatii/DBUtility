import { DateTime } from 'luxon';

function getDayPeriodForChisinau() {
    const nowInChisinau = DateTime.now().setZone('Europe/Chisinau');

    // Subtract the number of days from the start of the day
    const startDate = nowInChisinau.minus({ months: 5 }).startOf('month').toJSDate();
    
    const endDate = nowInChisinau.endOf('month').toJSDate();
    console.log(startDate, endDate);
}

getDayPeriodForChisinau();