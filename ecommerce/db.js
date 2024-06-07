// db.js
const { MongoClient } = require('mongodb');

const url = "mongodb://localhost:27017/ecommerce";

async function connectToDatabase() {
  try {
    // Connect to the MongoDB server 
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log("Connected to MongoDB");

    // Access the "ecommerce" database (if it doesn't exist, MongoDB will create it)
    const db = client.db();

    // Create a collection named "myCollection" (optional)
    // await db.createCollection('');

    // console.log('Collection created!');

    return db; // Return the database object
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

module.exports = connectToDatabase;
