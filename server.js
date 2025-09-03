const app = require('./app');
const connectDB = require('./config/config.db');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
