const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })

        console.log(`MongoDB connected to: ${con.connection.host}`);
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}

//const db = mongoose.connection;
module.exports = connectDB;


// const dBconnection = mongoose.createConnection(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true
//    });

// const conn = process.env.MONGO_URI;
// const dbConnection = mongoose.connect(conn, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true
// })
//     .then(() => console.log('Connected to DB'))
//     .catch(err => console.log(err));

// module.exports = dbConnection;