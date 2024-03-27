# Energy Consumption Calculator

This project includes the code which calculates the energy consumption data from a sensor, and updates the database with the calculated daily consumption.

The `dbService.js` script handles the database connections and CRUD operations, while the main script connects to the relevant database and runs the necessary functions to calculate and update the consumption data.

## Prerequisites

- Node.js

## Installation and Setup

1. Clone the repository
2. Run `npm install` to install all the required dependencies.
3. Create a `.env` file in the root directory of the project, with the following environment variables to connect to the PostgreSQL database:

```
PG_USER=[your postgres username]
PG_HOST=[your postgres host]
PG_DATABASE=[your postgres database name]
PG_PASSWORD=[your postgres password]
PG_PORT=[your postgres port]
```

**Note:** Be sure to replace the values inside [ ] with your own values. There should be no [ ] in the .env file.

## Running the script

Execute the main script by running the start script with `node main.js`.

## Additional information

The main script initially gathers historical data for sensors from the database, calculates the daily consumption based on the read values, and then erases old information from the database and writes the new calculated data.

The `DBService` class manages the database connections and operations such as `getDailyReading`, `insertData`, and `deleteData`.

Before running the program, ensure the DBService's `.connect()` and `.disconnect()` methods are called before and after running the `calculate()` function.