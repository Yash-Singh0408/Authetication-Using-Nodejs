const express = require ('express');
const expressLayouts = require ('express-ejs-layouts');
const mongoose = require ('mongoose');
const flash = require ('connect-flash');
const session = require('express-session');
const passport = require('passport')

const app = express();

//Passport Config
require ('./config/passport')(passport);

//DB Connect
const db = require('./config/keys').MongoURI;


//Connect to Mongo
mongoose.connect(db)
.then(()=>console.log('MongoDB Connected'))
.catch(err=>console.log(err));


//for impoerting imag
app.use(express.static('public'));

//Ejs
app.use(expressLayouts)
app.set('view engine','ejs')

//Body Parser
app.use(express.urlencoded( {extended:false} ));

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global Variable 
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg'); 
    res.locals.error_msg = req.flash('error_msg'); 
    res.locals.error = req.flash('error'); 
    next();
});

//Routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))

//initialise the Port 
const Port = process.env.PORT || 5000;


//Listining To Port 
app.listen(Port, console.log(`Server is started on ${Port}`))