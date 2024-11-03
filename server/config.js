const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        conn = await mongoose.connect('mongodb://localhost:27017/tempMeds', {
            readPreference: 'secondaryPreferred'
        })
        
        console.log(`MongoDB connected ${conn.connection.host}`);
    }
    catch(error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

module.exports = connectDB