const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const jwtSecret = process.env.JWT_SECRET;


router.post(
    "/", [
        check("name", "Nama tidak boleh kosong").not().isEmpty(),
        check("email", "Masukan email yang valid").isEmail(),
        check("password", "Minimal 6 karakter").isLength({min:6})
    ],
    async(req, res) =>{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({
                id:5,
                msg: "Input tidak sah",
                errors: errors.array()
            });
        }
        const {name, email, password} = req.body;

        try{
            let user =await User.findOne({email});
            if(user){
                return res.status(400).json({id:9, msg:"email sudah terpakai"});
            }

            user = new User({
                name,
                email,
                password
            });

            const salt = await bcrypt.gensalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user:{
                    id: user.id
                }
            };
            jwt.sign(payload, jwtSecret, {expiresIn: 3600}, (err, token)=>{
                if(err) throw err;
                res.json({token});
            });
        }catch (err){
            console.error(err.message);
            res.status(500).json({id:1, msg:"Server Error"})
        }
    }
);

module.exports = router;