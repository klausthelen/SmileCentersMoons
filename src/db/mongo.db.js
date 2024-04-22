const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function dateBaseConnect() {
    try {
      await client.connect();
      return client.db(process.env.MONGO_DB_NAME);
    } catch (err) {
      console.error(err);
    }
}

async function aggregate(collectionName, aggregation) {
    try {
      const db = await dateBaseConnect();
      const collection = db.collection(collectionName);
      const cursor = collection.aggregate(aggregation);
      return await cursor.toArray();
  
    } finally {
        await client.close();
    }
}

async function filter(collectionName, filter) {
    try {
      const db = await dateBaseConnect();
      const collection = db.collection(collectionName);
      const cursor = collection.find(filter);
      return await cursor.toArray();
  
    } finally {
        await client.close();
    }
}
  
module.exports = { aggregate, filter};
