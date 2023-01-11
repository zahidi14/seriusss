const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Students = require("../model/Students");
const Clases = require("../model/Clases");


router.get("/", auth, async(req, res)=>{
    try{
        const Student
    }
})