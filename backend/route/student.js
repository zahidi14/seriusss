const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Students = require("../model/Students");
const Clases = require("../model/Clases");
const Students = require("../model/Students");


router.get("/", auth, async(req, res)=>{
    try{
        const student = await Students.find({user: req.user.id}).populate("class", ["name"]).sort({
            date: -1
        }) ;
        res.json(student);
    }catch(err){
        console.error(err.message);
        res.status(500).json({id: 1, msg: "Server error."})
    }
});

router.get("/:id", auth, async(req,res)=>{
    try{
        const student= await Students.findById(req.params.id).populate(
            "class", ["name"]
        );
        res.json(Students);
    }catch(err){
        console.error(err.message);
        res.status(500).json({id: 1, msg: "Server error."});
    }
});

router.post(
    "/",
    [
        auth,[
        check("class", "class of sttudent is required").not().isEmpty(),
        check("firstName", "First Name Is Required").not().isEmpty(),
        check("nis", "NIS is required ").isNumber()
        ]
    ],
    async(req, res)=>{
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                id: 5,
				msg: "Some fields are invalid.",
				errors: errors.array()
            });
        }
        const { class: classID, firstName, nis} = req.body;

        try{
            if(!mongoose.Types.ObjectId.isValid(classID)){
                return res.status(500).json({id: 3, msg: "Object not found." });
            }

            const clas = await Clases.findById(classID);
            if (!clas){
                return res.status(500).json({id: 3, msg: "Object not found." });
            }

            const charLimit = 120;
            if(firstName.length > charLimit || lastName.length >charLimit){
                return res.status(500).json({
                    id: 11, msg: "Exceed character limit." 
                });
            }

            const reNames = /^([a-zñáéíóú, ]){1,75}$/i;
			const reNums = /^\d*$/;
            
            if(!reNames.test(lastName)){
                return res.status(500).json({
                    id: 5,
					msg: "Some fields are invalid.",
					field: "lastName"
                });
            }

            if(!reNames.test(firstName)){
                return res.status(500).json({
                    id: 5,
					msg: "Some fields are invalid.",
					field: "firstName"
                });
            }

            if(!reNums.test(nis)){
                return res.stattus(500).json({
                    id: 5,
					msg: "Some fields are invalid.",
					field: "nis"
                });
            }

            const student = await Students.find({user: req.user.id});

            for(let st of student){
                if (st.code.toString() === nis.toString()){
                    return res.status(500).json({
                        id: 10,
					    msg: "Already exists.",
					
                    });
                }
            }

            const newStudent = new Students({
                user: req.user.id,
                class: classID,
                firstName,
                lastName,
                nis
            });

            const Student = await newStudent.save();
            await Student.populate("class", ["name"]).execPopulate();
            
            await Clases.findByIdAndUpdate(
                classID,
                {$set: { student: [...group.student, Student._id] } },
                {new: true}
            );
            res.json(Student);
        }catch (err){
            console.error(err.message);
            res.status(500).json({ id: 1, msg: "server error"});
        }

    }
)

