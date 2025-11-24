import {MongoClient} from "mongodb";

const connectionString = process.env.ATLAS_URI || "Enter your MongoDB connection string here";

const client = new MongoClient(connectionString);

let conn;
try{
    conn = await client.connect();
} catch(e) {
    console.error(e)
}

let db = conn.db("project");

export default db;