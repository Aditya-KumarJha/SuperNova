require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB();

app.listen(4001, () => {
  console.log('Product service running on port 4001');
});
