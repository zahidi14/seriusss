const express = require('express');
const router =  express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// @route   GET api/auth
// @desc    get logged in user
// @access  private

router.get("/", auth, async (req, res) =>{
    try{
        const user = await User.findById(req.user.id).select([
            "-password",
            "-productkey"
        ]);
        res.json(user);
    }catch(err){
        console.log(err.message);
        res.status(500).json({id:1, msg: "Server Error"});
    }
});

// @route   POST api/auth
// @desc    auth user and get token
// @access  public

router.post("/",[
        check("email", "Masukan email yang sudah terdaftar").isEmail(),
        check("password", "Masukkan Password").exists()
    ],
    async (req, res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                id: 5.1,
                msg: "mboh field salah",
                errors: errors.array()
            });
        }
        const {email, password} =req.body;

        try{
            let user = await User.findOne({email});
            if (!user){
                return res.status(400).json({ id: 3, msg: "email tidak ditemukan" });
            }

            if(!isMatch) {
                return res.status(400).json({
                    id:5,
                    msg: "Password salah"
                });
            }

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                jwtSecret,
                {
                    expiresIn:30000 // mode dev: 8 jam
                },
                (err, token) =>{
                    if(err) throw err;
                    res.json({token});
                }
            );
        }catch (err){
            console.error(err.message);
            res.status(500).json({id:1, msg:"server error"});
        }
    }
);

module.exports =router;