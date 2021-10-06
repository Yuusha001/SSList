const _ = require('lodash');
const express = require('express');
const morgan = require('morgan');
const moogoose = require('mongoose');
const User = require('./Models/User');
const Product = require('./Models/Products');
const multer  =   require('multer'); 
var methodOverride = require('method-override'); 
const { result } = require('lodash');
const { render } = require('ejs');


//express app
const app = express();
app.use(methodOverride('_method'));

//mongoDB
const dbURI = 'mongodb+srv://Yuusha001:Yuusha123789@cluster0.27q6a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
moogoose.connect(dbURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((res) => {
    //open port
    app.listen(5000);
    console.log('Server open in port 5000 !');
}).catch((err) => console.log(err))

// view engine
app.set('view engine', 'ejs');

//midleware & static files
app.use(express.static('./Public'));
app.use(express.static('./uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


// Routing
app.get('/',(req,res) => {
    res.status(200).render('main', {title: 'Home'});
});

app.get('/aboutus',(req,res) => {
    res.status(200).render('aboutus', {title: 'About Us'});
});

app.get('/404',(req,res) => {
    res.status(404).render('404', {title: '404'});
});

app.get('/login',(req,res) => {
    res.status(200).render('login',{title: 'Login'});
});

app.get('/register',(req,res) => {
    res.status(200).render('register',{title: 'Register'});
});


app.get('/anime',(req,res) => {
    Product.find().then((result) => {
        res.render('anime',{title:'Anime', blogs: result});
    }).catch((err) => {
        console.log(err);
    })
});


app.get('/find',(req,res) => {
    Product.find().then((result) => {
        res.render('find',{title:'All Posts', blogs: result});
    }).catch((err) => {
        console.log(err);
    })
});

app.get('/post',(req,res) => {
    res.status(200).render('post',{title: 'Post'});
});

app.get('/',(req,res) => {
    res.status(200).redirect('main');
});



//Funcion
app.post('/register',(req,res) => {
    const NewUser = new User(req.body);
    NewUser.save().then((result)=>{
        res.redirect('/login');
    }).catch((err)=>{
        console.log(err);
    })
});


app.post('/login',(req,res) => {
    const ThisUser = {
        userName: req.body.userName,
        password: req.body.password
    };
    User.findOne(ThisUser).then((result1) => {
        if(result1 != null) {
            res.redirect(`login/${result1._id}`);
        }
        else res.redirect('404');
        
    }).catch((err)=>{
        console.log(err);
    })
});

app.get('/login/:id',(req,res)=>{
    const id = req.params.id;
    User.findById(id).then(result =>{
        res.render('admin',{ acc: result, title: 'User' });
    }).catch((err)=>{
        console.log(err);
    })
});

const storage = multer.diskStorage({  
    destination: function (req, file, cb) {  
        cb(null, 'uploads/');  
    },  
    filename: function (req, file, cb) {  
      cb(null, file.originalname);  
    }  
});  

const upload = multer({ storage : storage }).single('myfile');

app.post('/post', upload ,(req,res) => { 
    const product = new Product({
        title : req.body.title,
        snippet : req.body.snippet,
        body : req.body.body,
        image: req.file.originalname      
    });
    console.log(product);
    product.save().then((result)=>{
        res.redirect('/post');
    }).catch((err)=>{
        console.log(err);
    })
});


app.get('/anime/:id',(req, res) => {
    const id = req.params.id;
    Product.findById(id).then(result =>{
        res.render('details',{ blog: result, title: 'Details' });
    }).catch((err)=>{
        console.log(err);
    })
});

app.get('/anime/:id/edit',(req, res) =>{
    const id = req.params.id;
    Product.findById(id).then(result =>{
        res.render('edit',{title: 'Update', blog: result });
    }).catch((err)=>{
        console.log(err);
    })
})

app.put('/anime/:id', upload, (req, res) =>{
    const id = req.params.id;
    const update = {
        title : req.body.title,
        snippet : req.body.snippet,
        body : req.body.body,
        image: req.file.originalname      
    };
    Product.findByIdAndUpdate(id, update, {
        new: true,
        upsert: true,
        rawResult: true // Return the raw result from the MongoDB driver
    }).then(result =>{
        res.redirect('/find');
    });
})

app.delete('/anime/:id',(req, res) => {
    const id = req.params.id;
    Product.findByIdAndDelete(id).then(result =>{
        res.redirect('/find');
    });
})