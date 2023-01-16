const express = require("express");
const router = express.Router();
const auth =  require("../helper/auth");
const Ujians= require("../model/Ujians");
const { check, validationResult} = require("express-validator");
const { castObject, findByIdAndUpdate } = require("../model/Ujians");

router.get("/", auth, async(req, res)=>{
    try{
        const ujian = await Ujians.find({user: req.user.id})
        .populate("clas",["name"])
        .populate("mapel.mapels", "name")
        .sort({date: -1});
        res.json(ujian);
    }catch(err){
        console.error(err.message);
        res.status(500).json({id: 3, msg: "notfound"});
    }
});


router.post("/", 
    [
        auth,
        [
            check("clas", "masukan id kelas").not().isEmpty(),
            check("name", "masukan mata pelajaran ujian").not().isEmpty(),
            check("qty", "masukan jumlah soal ujian").not().isEmpty(),
            check("answer", "Masukan jawaban ujian").not().isEmpty()
        ]
    ],
    async(req, res)=>{
        const errors = validationResult(req);
     
            if(!errors.isEmpty()){
                return res.status(400).json({
                    id: 5, msg: "some field invalid",
                    errors: errors.array()
                });
            }
            const {
                name,
                evalDate,
                clas,
                qty,
                p_corr,
                p_incorr,
                p_blank,
                mapel,
                answers
            } = req.body;
        try{
            const newExam = new Exam({
                user: req.user.id,
                name,
                evalDate,
                clas,
                qty,
                p_corr,
                p_incorr,
                p_blank,
                mapel,
                answers
            });

            const exam = await newExam.save();
            res.json(exam);
        }catch(err){
            console.error(err.message);
            res.status(500).json({ id: 1, msg: "Server error." });
        }
    }
);


router.put("/:id", auth, async(req, res)=>{
  const {
    name,
    evalDate,
    clas,
    qty,
    p_corr,
    p_incorr,
    p_blank,
    mapel,
    answers
  } = req.body;


  const fields = {};

  if(name) fields.name= name;
  if(evalDate) fields.evalDate= evalDate;
  if(clas) fields.clas= clas;
  if(qty) fields.qty= qty;
  if(p_corr) fields.p_corr= p_corr;
  if(p_incorr) fields.p_incorr= p_incorr;
  if(p_blank) fields.p_blank= p_blank;
  if(mapel) fields.mapel= mapel;
  if(answers) fields.answers= answers;

  try{
    let exam = await Ujians.findByI(req.params.id);

    if(!exam){
        return res.status(404).json({ id: 3, msg: "Object not found." });
    }
    if(exam.user.toString() !== req.user.id){
        return res.status(401).json({id: 0, msg: "Not authorized."});
    }

    exam = await Ujians.findByIdAndUpdate(
        req.params.id,
        {$set: fields},
        {new: true}
    );
    res.json(exam);
  }catch(err){
    console.error(err.message);
    res.status(500).json({ id: 1, msg: "Server error." });
  }
});

router.delete("/:id", auth, async(req, res)=>{
    try{
        let exam = await Ujians.findById(req.params.id);

    if (!exam){
        return res.status(404).json({ id: 3, msg: "not found" })
    }
    if (exam.user.toString() !== req.user.id){
        return res.status(401).json({ id: 0, msg: "not authorized." })
    }

    await Ujians.findByIdAndRemove(req.params.id);
    res.json({ id: 7, msg: "Succesfuly removed" });
    }catch(err){
        console.error(err.message);
        res.status(500).json({ id: 1, msg: "Server error."})
    }
});

module.exports = router;