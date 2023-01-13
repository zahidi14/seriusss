const express = require("express");
const router = express.Router();
const auth = require("../helper/auth");
const Mapels = require("../model/Mapels");

router.get("/", auth, async(req, res)=>{
    try{
        const mapel = await Mapels.find({user: req.user.id});
        res.json(mapel);
    }catch(err){
        console.error(err.message);
		res.status(500).json({ id: 1, msg: "Server error." });
    }
});

router.get("/:id", auth, async(req, res) =>{
    try{
        const mapels =await Mapels.findById(req.params.id);
        res.json(mapel);
    }catch(err){
        console.error(err.message);
		res.status(404).json({ id: 3, msg: "Object not found." });
    }
});

router.post("/", 
    [
        check("name", "A full name is required.")
        .not()
        .isEmpty()
    ]    
    ,auth, async(req, res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({
                id: 5,
				msg: "Some fields are invalid.",
				errors: errors.array()
            });
        }

        const name =req.body;

        try{
            const newMapel = new Mapels({
                user: req.user.id,
                name
            });

            const mapels = await newMapel.save();
            res.json(mapels);
        }catch(err){
            console.error(err.message);
			res.status(500).json({ id: 1, msg: "Server error." });
        }
    }
);

router.put("/:id", auth, async(req, res)=>{
    const name =req.body;

    const fields= {};
    if (name) fields.name= name;

    try{
        let mapels = await Mapels.findById(req.params.id);
        if(!mapels){
            return res.status(404).json({id:3, msg: "not found"});
        }

        if(mapels.user.toString() !== req.user.id){
            return res.status(401).json({id: 0,  msg:"not Authorized"});
        }

        mapels = await Mapels.findByIdAndUpdate(
            req.params.id,
            {$set: fields},
            {new: true}
        );
        res.json(mapels);
    }catch(err){
        console.error(err.message);
		res.status(500).send("Server error.");
    }
});

router.delete("/:id", auth, async(req,res)=>{
    try{
        let mapels = await Mapels.findById(req.params.id);
        if(!mapels){
            return res.status(404).json({id:3, msg:"object not found"});
        }
        if(mapels.user.toString() !== req.user.id){
            return res.status(404).json({id:3, msg:"object not found"});
        }

        await Mapels.findByIdAndRemove(req.params.id);
        res.json({id:7, msg: "Successfuly removed"});
    }catch(err){
        console.error(err.message);
        res.status(500).send("server error");
    }
});

module.exports = router;