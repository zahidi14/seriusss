const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Students = require("../model/Students");
const Clases = require("../model/Clases");
const Students = require("../model/Students");
const { update } = require("../model/Students");


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
            await Student.populate("clas", ["name"]).execPopulate();
            
            await Clases.findByIdAndUpdate(
                classID,
                {$set: { student: [...clas.student, Student._id] } },
                {new: true}
            );
            res.json(Student);
        }catch (err){
            console.error(err.message);
            res.status(500).json({ id: 1, msg: "server error"});
        }

    }
);


router.post("/many", auth, async(req, res)=>{
    try{
        const studentInDB= await Students.find({ user: req.user.id});

        const classID= req.body[0].clas;
        const clas= await Clases.findById(classID);

        if(!clas){
            return res.status(500).json({ id: 3 , msg: "not found"})
        }

        const arr = req.body.map((obj)=>{
            const {firstName, lastName, nis} = obj;
            if(!mongoose.Types.ObjectId.isValid(classID)){
                return res.status(500).json({id: 3, msg: "Object not found."});
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
            };

            for(let st of studentInDB){
                return res.status(500).json({
                    id:10,
                    msg: "Allready exist"
                })
            };
            return new Students({
                user : req.user.id,
                clas: classID,
                firstName,
                lastName,
                nis
            });
        });

        let newStudentIds= [];

        Students.collection.insertMany(arr, (err, docs)=>{
            if(err) throw err;
            else{
                docs.ops.forEach(async(doc, i) => {
                    newStudentIds.push(doc._id);

                    await doc
                    .populate("clas",["name"])
                    .execPopulate();
                    if(i=== docs.ops.length -1){
                        await Clases.findByIdAndUpdate(
                            classID,
                            {
                                $set:{
                                    student:[
                                        ...clas.student,
                                        ...newStudentIds
                                    ]
                                }
                            },
                            {new: true}
                        );
                        return res.json(docs.ops);

                    }
                });
            }
        });
    }catch(err){
        console.error(err.message);
        res.status(500).json({id: 1, msg: "server error"})
    }
});

router.put("/one/:id", auth, async(req,res)=>{
    const{ clas:classID, firstName, lastName, nis} = req.body;

    const fields= {};
    const charLimit = 120;
    const reNames = /^([a-zñáéíóú, ]){1,75}$/i;
	const reNums = /^\d*$/;
    
    if(classID !== null){
        if(!mongoose.Types.ObjectId.isValid(classID)){
            return res.status(500).json({ id: 3.1, msg: "Object not found." })
        }
        const clas = await Clases.findById(classID);
        if(!clas){
            return res.status(500).json({ id: 3.2, msg: "Object not found." })
        }
        fields.clas = classID;
    }
    if(firstName){
        if(firstName.length> charLimit){
            return res.status(500).json({
                id: 11,
				msg: "One or more fields exceeded character limit."
            });
        }

        if (!reNames.test(firstName)) {
			return res.status(500).json({
				id: 5,
				msg: "Some fields are invalid.",
				field: "firstName"
			});
		}

        fields.firstName = firstName
    }

    if(lastName){
        if(lastName.length> charLimit){
            return res.status(500).json({
                id: 11,
				msg: "One or more fields exceeded character limit."
            });
        }

        if (!reNames.test(lastName)) {
			return res.status(500).json({
				id: 5,
				msg: "Some fields are invalid.",
				field: "lastName"
			});
		}

        fields.lastName = lastName
    };
    if(nis){
        if(!reNums.test(nis)){
            return res.status(500).json({
                id: 5,
                msg: "invalid field",
                field: "nis"
            });
        }

        const student = await Students.find({user: req.user.id});

        for (let st of student){
            if(st.nis.toString() === nis.toString()&& req.params.id !== st._id.toString()){
                return res.status(500).json({
                    id: 10,
                    msg: "allready exist"
                });
            }
        }
        fields.nis= nis;
    }

    try{
        let student= await Students.findById(req.params.id);
        if(!student){
            return res.status(404).json({id: 3, msg: "Object not found."});
        }

        const oldClasId = student.clas;

        if (student.user.toString() !== req.user.id){
            return res.status(401).json({id: 0, msg: "Not authorized."})
        }

        student = await Students.findByIdAndUpdate(
            req.params.id,
            { $set: fields },
			{ new: true }
        );

        await student.populate("clas", ["name"]).execPopulate();

        if (classID !==null){
            const oldClass = await Clases.findById(oldClasId);
            const oldClassUpdateStudent = oldClass.Students.filter(
                (st) => st._id.toString() !== student._id.toString()
            );

            await Clases.findByIdAndUpdate(
                oldClasId,
                {$set: {student: oldClassUpdateStudent}},
                {new: true}
            );

            const clas = await Clases.findById(classID);

            await Clases.findByIdAndUpdate(
                classID,
                {$set:{ student: [...clas.student, student._id]}},
                { new: true }
            );
        }

        res.json(student);
    }catch(err){
        console.error(err.message);
        res.status(500).json({
            id: 1,
            msg: "server error"
        });
    }
});


router.put("/many", auth, async(req, res)=>{
    try{
        const classID =req.body.clas;
        const ids= req.body.data;

        if(mongoose.Types.ObjectId.isValid(classID)){
            return res.status(500).json({
                id: 3,
                msg: "object not found",
                obj: "clas"
            })
        }

        const clas = await Clases.findById(classID);

        if(!clas){
            return res.status(500).json({
                  id: 3,
                msg: "object not found",
                obj: "clas"
            });
        }

       if (ids.length < 1) {
			return res.status(500).json({
				id: 5,
				msg: "Some fields are invalid.",
				obj: "ids"
			});
		}

		if (ids.length > 30) {
			return res.status(500).json({
				id: 12,
				msg: "Exceeded limit of items to apply action."
			});
		}

        const student = await Students.find({
            _id:{ $in: ids}
        });


        for (let st of student){
            if (st.user.toString() !== req.user.id) {
				return res.status(401).json({ id: 0, msg: "Not authorized." });
			}

            const oldClass = await Clases.findById(st.group);
            const oldClassUpdateStudent = oldClass.student.filter(
                (s)=> s._id.toString() !== st._id.toString()
            );

            await Clases.findByIdAndUpdate(
                st.clas,
                {$set: {student: oldClassUpdateStudent}},
                {new: true}
            );
        }

        if (update.n === ids.length){
            const student = await Students.find({
                user: req.user.id,
                _id: {$in: ids}
            }).populate("clas",["name"]);

            await Clases.findByIdAndUpdate(
                 classID,
                {$set:{ student: [...clas.student, student._id]}},
                { new: true }
            );
            res.json(student);
        }else{
            res.status(500).json({ id: 1, msg: "Server error." })
        }

    }catch(err){
        console.error(err);
        res.status(500).json({ id: 1, msg: "Server error." });
    }
});


router.delete("/one/:id", auth, async(req, res)=>{
    try{
        let student = await Students.findById(req.params.id);
        if(!student){
            return res.status(404).json({id:3, msg: "object not found"});
        }

        if(student.user.toString() !== req.user.id){
            return res.status(401).json({id: 0, msg: "not authorized"})
        }

        await Students.findByIdAndRemove(req.params.id);
        res.json({id: 7, msg:"Suesfully Removed"});
    }catch(err){
        console.error(err);
        res.status(500).json({ id: 1, msg: "Server error." });
    }
});


router.delete("/many", auth, async(req, res)=>{
   try{ const ids =  req.body;

    if (ids.length < 1) {
			return res.status(500).json({
				id: 5,
				msg: "Some fields are invalid.",
				obj: "ids"
			});
	}
    const student = await Students.find({
        _id: { $in: ids }
    });

    for( let st of student){
        if (st.user.toString() !== req.user.id) {
				return res.status(401).json({ id: 0, msg: "Not authorized." });
			}
    }

    await Students.deleteMany(
        { user: req.user.id, _id: { $in: ids } },
			(err) => {
				if (err) {
					res.status(500).json({ id: 1, msg: "Server error." });
					console.error(err);
				} else {
					res.json({ id: 7, msg: "Objects(s) removed." });
				}
			}
    );
    }catch(err){
        console.error(err);
        res.status(500).json({ id: 1, msg: "Server error." });
    }

});

module.exports = router;
