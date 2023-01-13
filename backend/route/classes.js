const express = require("express");
const router = express.Router();
const auth = require("../helper/auth");
const clases = require("../model/Clases");

const { check, validationResult } = require("express-validator");

router.get("/", auth, async(req, res)=>{
    try{
        const classes= await clases.find({
            user: req.user.id
        }).populate("student", ["_id", "code", "firstName", "lastName"]);
        res.json(classes);
    }catch(err){
        console.error(err.message);
        res.status(500).json({id:1, msg:"server error"});
    }
});


router.get("/:id", auth, async(req, res)=>{
    try{
        const clas = await clases.findById(req.params.id).populate("student", ["_id", "code", "firstName", "lastName"]);
        res.json(clas);
    }catch(err){
        console.error(err.message);
        res.status(500).json({ id: 1, msg: "Server error." });
    }
});

router.post("/", auth, 
    [
        check("name", "name is required").not().isEmpty()
    ], async(req, res)=>{
        const errors= validationResult(req);
        if(!errors.isEmpty){
            return res.status(400).json({
                id: 5,
				msg: "Some fields are invalid.",
				errors: errors.array()
            });
        }

        const {name, desc, color, student, mapel, ujuan} =req.body;

        const colors = ["yellow", "blue", "purple", "celeste", "green", "red"];
        const charLimit = 120;

        if(name.length >charLimit || desc.length > charLimit ){
            res.status(500).json({
                id: 11,
				msg: "One or more fields exceeded character limit."})
        }

        try{
            const newClass = new clases({
                user: req.user.id,
                name,
                des,
                color: colors.includes(color)?color : colors[0],
                student,
                mapel,
                ujian
            });

            const clas = await newClass.save();
            res.json(clas);
        }catch (err){
            console.error(err.message);
            res.status(500).json({ id: 1, msg: "Server error." });
        }   
});


router.put("/:id", auth, async(req, res)=>{
    const {name, desc, color, student, mapel, ujuan} =req.body;
    const colors = ["yellow", "blue", "purple", "celeste", "green", "red"];
    const charLimit = 120;

    if(name.length >charLimit || desc.length > charLimit ){
        res.status(500).json({
            id: 11,
            msg: "One or more fields exceeded character limit."})
    }

    const fields = {};
    if (name) fields.name = name;
    if (desc) fields.desc = desc;
    if (color) fields.color = colors.includes(color)?color : colors[0]
    if (student) fields.student= student;
    if (mapel) fields.mapel= mapel;
    if (ujian) fields.ujian= ujian;

    try{
        let clas = await clases.findById(req.params.id);

        if(!clas){
            return res.status(404).json({ id: 3, msg: "Object not found." });
        }

        clas = await clases.findByIdAndUpdate(
            req.params.id,
            { $set: fields },
			{ new: true }
        );

        await clas.populate("student", ["_id", "code", "firstName", "lastName"]).execPopulate();
        res.json(clas);
    }catch(err){
        console.error(err.message);
		res.status(500).json({ id: 1, msg: "Server error." });
    }
});

router.delete("/:id", auth, async(req, res)=>{
    try{
        let clas = await clases.findById(req.params.id);

        if(!clas){
            return res.status(404).json({ id: 3, msg: "Object not found." });
        }
        if (clas.user.toString() !== req.user.id){
            return res.status(401).json({id:0, msg:"not authorized"});
        }

        await clases.findByIdAndRemove(req.params.id);
        res.json({id:7, msg:"Removed"});
    }catch(err){
        console.error(err.message);
        res.status(500).json({ id: 1, msg: "Server error." });
    }
});

module.exports = router;