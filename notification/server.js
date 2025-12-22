require('dotenv').config();
const app = require('./src/app');

app.listen(4006, () => {
    console.log('Notification service is running on port 4006');
});
