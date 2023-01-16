const express = require ("express");
const router= express.Router();
const auth = require("../helper/auth");
const path = require("path");
const xlsx = require("xlsx");


router.post("/", auth, (req, res)=>{
    if(req.files === null){
        return res.status(400).json({Id:8, msg: "no File was Uplaoded"});
    }

    const file = req.files.file;
    let fileName = file.name;
    const fileExt = path.extname(fileName).substr(1);
    const fileTypes = ["png", "jpg", "jpeg"];

    if (!fileTypes.includes(fileExt)){
        return res.status(400).json({ id:5, msg:"File is not image type"})
    }
    if(fileName.indexOf(" ")>= 0){
        fileName = fileName.split(" ").join("_");
    }

    file.mv(
        `${__dirname}/../public/user_uploads/school_logos/${fileName}`,
        (err)=>{
            if(err){
                console.error(err);
                return res.status(500).json({id:1, msg: "server error", error:err});
            }
        }
    )
});

router.post("/student", auth, (req, res)=>{
    if (req.files === null){
        return res.status(404).json({id: 8, msg: "no file was uploaded"})
    }

    const file = req.files.file;
    let fileName = file.name;
    const fileExt = path.extname(fileName).substr(1);

    if (fileExt !== "xlsx"){
        return res.status(400).json({id:5, msg:"file is not allowed type"});
    }

    if (fileName.indexOf(" ") >=0){
        fileName = fileName.split(" ").join("_");
    }

    const filePathFull = `${__dirname}/../public/user_uploads/students/${fileName}`;

	file.mv(filePathFull, (err) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ id: 1, msg: "Server error.", error: err });
		}

		const wb = xlsx.readFile(filePathFull);
		const sheet = wb.Sheets[wb.SheetNames[0]];
		const data = xlsx.utils.sheet_to_json(sheet);

		if (data.length > 0) {
			return res.json(data);
		} else {
			return res.status(500).json({ id: 3, msg: "Data not found" });
		}
	});
})

module.exports = router;