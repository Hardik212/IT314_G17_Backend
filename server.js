const express = require('express');
const cors = require('cors');
// const passport = require('passport');
// const cookieSession = require("cookie-session");
const bodyParser = require('body-parser');
const connectDB = require('./db/connect');
const cookieParser = require('cookie-parser');
// const passportSetup = require('./passport');
// const authRoute = require("./routes/auth");

// import routes
const router = require('./Router');


const app = express();
// const PORT = process.env.PORT || 3000;

// create the express middleware
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());


// routes
app.use('/api', router);
// app.use("/auth", authRoute);

// app.use(
//     cookieSession({
//         name: "session",
//         keys: ["cyberwolve"],
//         maxAge: 24 * 60 * 60 * 100, // 24 hours
//     })
// );

// app.use(passport.initialize());
// app.use(passport.session());

app.use(
    cors({
        origin: "http://localhost:3001", // <-- location of the react app were connecting to
        methods: "GET,PUT,POST,DELETE",
        credentials: true,
    })
);

// const port = process.env.PORT || 8080;
// app.listen(port, () => console.log('Listening on port ${port}...'));

// error handling middleware  
app.use((err, req, res, next) => {     
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;
    res.status(status).json({ message: message, data: data });
});  

const PORT = process.env.PORT;
const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}...`);
        });
    } catch (error) {
        console.log(error);
    }
};


start();
