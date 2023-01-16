const express = require("express");
const router = express.Router();
const auth = require("../helper/auth");
const { check, validationResult } = require("express-validator");
const Gurus = require("../model/Gurus");


router.get("/", auth, async(req, res) =>{
    try{
        const guru= await Gurus.findOne({user:req.user.id});
        if (guru === null){
            res.status(404).json({
                id: 3,
                msg: "tidak ditemukan"
            });
        }else{
            res.json(guru)
        }
    }catch (err){
        console.error(err.message);
        res.status(404).json({
            id: 4,
            msg: "unexpected error"
        });
    }
});



router.post(
    "/",[
        auth,[
            check("name", "Masukkan nama").not().isEmpty()
        ]
    ],
    async (req, res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                id: 5.1,
                msg: "field invalid",
                errors: error.array()
            });
        }

        const {
            foto,
            name,
            desc,
            address,
            email,
            phone
        } = req.body;

        try {
            const charLimit = 120;

            if(
                name.length > charLimit ||
                desc.length > charLimit ||
                address.length > charLimit ||
                email.length > charLimit ||
                phone.length > charLimit
            ){
                return res.status(500).json({
                    id:11,
                    msg: "karakter melebihi batas"
                });
            }
            const regex = /^([0-9a-zñáéíóú_\-',.° ]){1,100}$/i;

            if(
                !regex.test(name) &&
				!regex.test(desc) &&
				!regex.test(address) &&
				!regex.test(email) &&
				!regex.test(phone)
            ){
                return res.status(500).json({
                    id: 5,
                    msg: "invalid field"
                });
            }

            const newGuru = new Gurus({
                user: req.user.id,
                foto,
                name,
                desc,
                address,
                email,
                phone
            });

            const guru = await newGuru.save();
            res.json(guru);
        }catch(err){
            console.error(err.message);
            res.status(500).json({id:1, msg: "server error"});
        }
    }
);


router.put("/:id", auth, async (req, res)=>{
    const { foto, name, desc, address, email, phone} =req.body;

    const guruFields = {};

    if(foto){
        if(foto.fileName && foto.filePath){
            guruFields.foto = foto;
        }else {
            return res.status(400).json({ id: 6, msg: "Object partially empty." })
        }
    }
    if(name) guruFields.name = name;
    if(desc) guruFields.desc = desc;
    if(address) guruFields.address = address;
    if(email) guruFields.email = email;
    if(phone) guruFields.phone = phone;

    try{
        let guru = await Gurus.findById(req.params.id);

        if (!guru)
            return res.status(404).json({
                id: 4,
				msg: "unexpected error."
            });
        if(guru.user.toString() !== req.user.id){
            return res.status(401).json({ id: 0, msg: "Not authorized." })
        }

        guru = await Gurus.findByIdAndUpdate(
            req.params.id,
            {$set: guruFields},
            {new:true}
        );
        res.json(guru)
    }catch (err){
        console.error(err.message);
        res.status(500).json({
            id: 4,
			msg: "Object not found because of an unexpected error."
        });
    }
});


router.delete("/:id", auth, async(req, res)=>{
    try{
        let guru =await Gurus.findById(req.params.id);

        if(!guru) return res.status(404).json({ id: 3, msg: "not found"});

        if(guru.user.toString() !== req.user.id){
            return res.status(401).json({ id:0, msg:"nott authorized"})
        }
    }catch(err){
        console.error(err.message);
        res.status(500).json({id: 1, msg: "Server error." });
    }
});

module.exports = router;