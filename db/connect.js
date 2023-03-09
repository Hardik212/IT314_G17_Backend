const mongoose = require('mongoose');
const dotenv = require('dotenv');

// connection making with database
dotenv.config();
const username = process.env.MONGO_URI_USERNAME;
const password = process.env.MONGO_URI_PASSWORD;
const uri = `mongodb+srv://${username}:${password}@harsh.n1n7opc.mongodb.net/Harsh?retryWrites=true&w=majority`;

const connectDB = () =>{
    console.log("Connecting to DB");
    return mongoose.connect(
        uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    );
}

module.exports = connectDB;