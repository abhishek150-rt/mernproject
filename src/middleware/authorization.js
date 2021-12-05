const loginCookie = require("jsonwebtoken");
const Student = require("../models/user");

const authorization=  async(req,res,next)=>{
    try{
        const token= req.cookies.loginCookie;
        const verifyUser= loginCookie.verify(token, process.env.SECRET_KEY);

        const student= await Student.findOne({_id:verifyUser._id});
        console.log(student.firstname);
        next();
    }
    catch(err){
       res.status(400).send("please login to get access to this page");
    }
}

module.exports=authorization;