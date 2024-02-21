import session from 'express-session';
import MongoDBSessionStore from 'connect-mongodb-session';
import dotenv from 'dotenv';
dotenv.config();

const MongoDBStore = MongoDBSessionStore(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_STR,
  collection: 'sessions',
});

store.on('error', (error) => {
  console.error('MongoDB session store error:', error);
});

export default store;
