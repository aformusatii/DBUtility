import pg from "pg"
import dotenv from "dotenv"

dotenv.config({path: '../.env'})

console.log('process.env.PG_USER', process.env.PG_USER)

export class DBService {

    constructor() {
        this.client = new pg.Client({
            user: process.env.PG_USER,
            host: process.env.PG_HOST,
            database: process.env.PG_DATABASE,
            password: process.env.PG_PASSWORD,
            port: process.env.PG_PORT
        })
    }

    connect() {
        this.client.connect()
    }

    async disconnect() {
        await this.client.end()
    }

    async getDailyReading(options) {
        const query = `
            SELECT
               date_trunc('day', insert_tmstmp) as day,
               (array_agg(float_value ORDER BY insert_tmstmp ASC))[1] as first_reading
            FROM
               sensor_data
            WHERE
               sensor = $1 AND
               channel = $2 AND
               insert_tmstmp BETWEEN $3 AND $4
            GROUP BY
               day
            ORDER BY
               day
            `.trim()

        const res = await this.client.query(
            query,
            [options.sensorId, options.channel, options.startDate, options.endDate]
        )

        return res.rows
    }

    async insertData(records) {
        let query = 'INSERT INTO sensor_data(sensor, channel, float_value, event_tmstmp) VALUES '
        let values = []

        let index = 1
        records.forEach((record) => {
            let fields = []
            fields.push(record.sensor)
            fields.push(record.channel)
            fields.push(record.value)
            fields.push(record.time)

            query += `(`
            fields.forEach(field => {
                query += `$${index},`
                index++
                values.push(field)
            })
            query = query.slice(0, -1)
            query += `),`
        })

        // Remove the trailing comma
        query = query.slice(0, -1)

        //console.log('query', query)

        await this.client.query(query, values)
    }

    async deleteData(options) {
        const query = `DELETE FROM sensor_data WHERE sensor = $1 AND channel = $2 AND event_tmstmp BETWEEN $3 AND $4`
        await this.client.query(query, [options.sensorId, options.channel, options.startDate, options.endDate])
    }

}