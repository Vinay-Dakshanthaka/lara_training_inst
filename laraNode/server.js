require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models'); // Import your Sequelize models
const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Enable CORS
app.use(cors());

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
