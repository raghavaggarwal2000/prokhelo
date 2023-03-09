const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const User = require('./model/User');
const { checkUser, requireAuth } = require('./middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const app = express();

const dbUrl = 'mongodb+srv://clg-project:test1234@clg-project.xksl3.mongodb.net/proKhelo?retryWrites=true&w=majority'

// connecting to mongo db database
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology:true})
.then(() =>{
    console.log('open on http://localhost:3000/')
    console.log("connected to db");
    app.listen(3000);
})
.catch(err => console.log(err));


// this is used to register for view engine ie to connect with front end more easily
app.set('view engine', 'ejs');
app.use(express.static('public'));

// this will take the form data(if submitted by the user) and with be connected to req object
app.use(express.urlencoded({extended: true}));

// this will take any json data which will come along with req and it passes it to javascript object and attaches it to 
// req object so that we can use it. Ex: using json we can use it
app.use(express.json());

//middleware(create cookies)
app.use(cookieParser());

// This is a middleware which will give user._id to each view so that we can use accordingly
app.get('*', checkUser);

app.get('/', (req, res) =>{
    res.render('index', {title: 'Home'});
});

app.get('/profile', requireAuth, (req,res) =>{
    res.render('profile', {title: 'Profile'});
});

app.put('/profile', async(req, res) =>{
    console.log(req.body);
    const {id, registered, name, age, gender} = req.body;
    const userUpdate =  await User.findByIdAndUpdate(id, {name: name, age: age, gender: gender});
    
    res.status(201).json({user: id});

});

app.get('/all_details', async (req,res) =>{
    const data = await User.find({});
    console.log(data);
    res.render('all_details', {title: 'All Details', data});
})
app.use(authRoutes);

