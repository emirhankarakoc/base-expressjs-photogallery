const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require('multer');

//image upload
var storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'./uploads')
    },
    filename: function (req,file,cb){
        cb(null,file.fieldname+"_"+ Date.now() + "_"+ file.originalname);
    }
});
var upload = multer({
    storage:storage,
}).single('image');




//insert an user into db
router.post("/add", upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,
        });

        await user.save();

        req.session.message = {
            type: 'success',
            message: 'User added successfully!'
        };

        // Yönlendirme işlemi burada yapılmalı
        res.redirect('/'); // Ana sayfaya yönlendir

    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

//get all users route
router.get('/', async (req, res) => {
    try {
        const users = await User.find().exec();
        res.render('layout/index', {
            title: "Home Page",
            users: users
        });
    } catch (err) {
        res.json({ type: 'danger', message: err.message });
    }
});


router.get('/add',(req,res)=>{res.render("layout/add_users",{title:"Add Users"})});

module.exports = router;