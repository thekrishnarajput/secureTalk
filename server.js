const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('flash');
const password = require('passport');

const container = require('./container');


const port = process.env.PORT || 3000;

container.resolve(function (users) {

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/secureTalk', {useMongoClient: true});


    const app = SetupExpress();
    function SetupExpress() {
        const app = express();
        const server = http.createServer(app);
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
        ConfigureExpress(app);
        // Setup router
        const router = require('express-promise-router')();
        users.SetRouting(router);
        app.use(router);
    }

    function ConfigureExpress(app) {
        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use(validator());
        app.use(session({
            secret: 'mysecretkey@123',
            resave: true,
            saInitialized: true,
            store: new MongoStore({mongooseConnection: mongoose.connection})
        }));
        app.use(flash());
        app.use(passport.saInitialize());
        app.use(password.session());
    }

});