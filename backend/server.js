const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

const dbsetup = require('./dbsetup');
dbsetup.connect();
dbsetup.populate();

const app = express();

app.use(cors());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const auth = require('./auth');
auth.setup(app);

// http://localhost:3002/api/health-check

const apiBaseUrl = '/api';

app.use(apiBaseUrl, require('./controllers/auth.controller'));
app.use(apiBaseUrl + '/restaurants', require('./controllers/restaurants.controller'));

app.listen(3002, () => {
    console.log('a szerver elindult');
});