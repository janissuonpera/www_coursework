//Requires
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-hbs');
const helmet = require('helmet');
const router = require('./router');
const session = require('express-session');

//Initialize express app
const app = express();

//Setting up handlebars and views for mvc
app.engine('hbs', hbs.express4());
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views'));
//Register helper for handlebars
hbs.registerHelper("equals", function(string1 ,string2, options) {
    if (string1 === string2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

//Use middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))


app.use("/", router);

//Using port 5000 because create-react-app uses port 3000
const port = 5000;
app.listen(port, ()=>console.log(`Server running on port ${port}`));
