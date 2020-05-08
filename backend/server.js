const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const dbsetup = require('./dbsetup');
dbsetup.connect();
dbsetup.populate();

const app = express();

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    credentials: true
  }
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const auth = require('./auth');
auth.setup(app);

const apiBaseUrl = '/api';

const unathorizedPaths = [apiBaseUrl + '/login', apiBaseUrl + '/registrate'];
app.use(function (req, res, next) {
  if(!unathorizedPaths.some(path => path === req.path) && !req.isAuthenticated()){
    return res.status(403).send('Ehhez be kell jelentkezni');
  }
  next()
})

app.use(apiBaseUrl, require('./controllers/auth.controller'));
app.use(apiBaseUrl + '/restaurants', require('./controllers/restaurants.controller'));

app.listen(3002, () => {
    console.log('a szerver elindult');
});