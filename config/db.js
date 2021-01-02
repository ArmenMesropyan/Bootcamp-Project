const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });

        console.log(
            `MongoDB Connected to ${conn.connection.name}, host: ${conn.connection.host}`,
        );
    } catch (error) {
        console.log(`Database connection error ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDb;
