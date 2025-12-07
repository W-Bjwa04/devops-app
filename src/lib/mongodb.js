import { MongoClient } from 'mongodb';

// Allow build without MongoDB URI (will fail at runtime if not set)
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';
const options = {
    maxPoolSize: 10,
    minPoolSize: 5,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to preserve the client across module reloads
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production mode, create a new client
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;

export async function getDatabase() {
    const client = await clientPromise;
    return client.db('todoapp');
}

export async function getTodosCollection() {
    const db = await getDatabase();
    return db.collection('todos');
}

export async function getUsersCollection() {
    const db = await getDatabase();
    return db.collection('users');
}
