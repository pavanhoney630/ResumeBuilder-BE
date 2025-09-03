const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//User Route Variables
const AuthRoutes = require('./routes/AuthRoutes/Auth.routes');

// Resume Route Variables
const ResumeRoutes = require('./routes/ResumeRoutes/ResumeBuilder.routes');


//Use Routes
app.use('/api/auth',AuthRoutes);

// Resume Routes
app.use('/api/resume',ResumeRoutes);


app.listen(5000,()=>{
    console.log("Server is running on port 5000");
});

app.get('/',(req,res)=>{
    res.send("API is running...");
});

module.exports = app;