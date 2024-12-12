import { MongoClient } from 'mongodb'

const URL = "mongodb://root:jG6bcO5FOO52PK!@192.168.100.3:27017/admin";
const client = new MongoClient(URL);

async function main() {
    try {
        // Use connect method to connect to the Server
        await client.connect();
        console.log("Connected successfully to server");

        const db = client.db('librechat');

        await db.command({
            createUser: 'librechat',
            pwd: 'pic12f675',
            roles: [{
                role: 'dbAdmin',
                db: 'librechat'
            }]
        });

        // Perform further operations on the database here

    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

main();