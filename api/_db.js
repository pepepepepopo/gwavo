const mongoose = require('mongoose');
let cached = global.mongoose || { conn: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;
  cached.conn = await mongoose.connect(process.env.MONGO_URI);
  return cached.conn;
}
module.exports = dbConnect;
