require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Test DB Connected:', conn.connection.host);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Test DB connection error:', err.message);
    process.exit(1);
  }
})();
