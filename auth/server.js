require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB();

app.listen(4000, () => {
    console.log('Auth service is running on port 4000');
}); 
