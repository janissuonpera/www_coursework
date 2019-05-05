//Requires
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-hbs');
const helmet = require('helmet');
const router = require('./router');
const api = require('./api/api')
const session = require('express-session');
const path = require('path');

//Initialize express apps
const hbsApp = express();
const reactApp = express();

//Setting up handlebars and views for mvc
hbsApp.engine('hbs', hbs.express4());
hbsApp.set('view engine', 'hbs');
hbsApp.set('views', __dirname + '/views');
hbsApp.use(express.static(__dirname + '/views'));

//Register helper for handlebars
hbs.registerHelper("equals", function(string1 ,string2, options) {
    if (string1 === string2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

//Use middleware for hbsApp
hbsApp.use(bodyParser.json())
hbsApp.use(bodyParser.urlencoded({extended: true}))
hbsApp.use(helmet());
hbsApp.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))
//Use middleware for reactApp
reactApp.use(bodyParser.json())
reactApp.use(bodyParser.urlencoded({extended: true}))
reactApp.use(helmet());
reactApp.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))


//Catches all requests made to REST API
reactApp.use("/api", api);
//Catches all other requests
hbsApp.use("/", router);

//Serve Create-react-app build as static
reactApp.use(express.static(path.join(__dirname, 'client/build')));

//Using port 5000 because create-react-app uses port 3000
const hbsport = 5000;
hbsApp.listen(hbsport, ()=>console.log(`Template Engine running on port ${hbsport}`));

const reactport = 3000;
reactApp.listen(reactport, ()=>console.log(`React running on port ${reactport}`));
