const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");
const logger = require("../controllers/loggerController");


const connectDB = async(options)=>{
    try {
        await mongoose.connect(mongodbURL, options={});
        // console.log('Database connected')
        
        logger.log("info", "Database connected")

        mongoose.connection.on('error', (error) =>{
            logger.log('error', 'Database connection error', error)
        })
    } catch (error) {
        logger.log('error', 'Database could not connect to DB:', error.toString())
    }
}

module.exports = connectDB;