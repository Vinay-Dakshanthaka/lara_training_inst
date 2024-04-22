require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models'); // Import your Sequelize models
const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    // origin: 'https://www.laragrooming.com',
    origin: ['https://www.laragrooming.com', 'https://laragrooming.com'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  
// Enable CORS 
app.use(cors(corsOptions)); 
// app.use(cors()); 

// Routers
const router = require('./routes/studentRoutes.js');
app.use('/api/student', router);

// Static Images Folder
app.use('/Images', express.static('./Images'));

// Port
const PORT = process.env.PORT || 8080;

// Synchronize database and start server
db.sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Error synchronizing database:', error);
});
  