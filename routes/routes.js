const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require('multer');
const fs = require('fs');

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

router.get('/edit/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let user = await User.findById(id).exec();

        if (!user) {
            res.redirect('/');
        } else {
            res.render("layout/edit_users", {
                title: "Edit User",
                user: user
            });
        }
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

router.post('/update/:id', upload, async (req, res) => {
    try {
        let id = req.params.id;
        let new_image = "";

        if (req.file) {
            new_image = req.file.filename;
            try {
                fs.unlinkSync('./uploads' + req.body.old_image);
            } catch (e) {
                console.log(e);
            }
        } else {
            new_image = req.body.old_image;
        }

        await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,
        });

        req.session.message = {
            type: 'success',
            message: 'User successfully updated!..'
        };
        res.redirect('/');
    } catch (e) {
        res.json({ message: e.message, type: 'danger' });
    }
});


//Delete user route
router.get('/delete/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let result = await User.findByIdAndDelete(id);

        if (result && result.image !== '') {
            try {
                fs.unlinkSync("./uploads/" + result.image);
            } catch (e) {
                console.log(e);
            }
        }

        req.session.message = {
            type: 'success',
            message: 'User successfully deleted from database.!!'
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});






module.exports = router;