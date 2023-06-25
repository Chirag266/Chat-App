// JWT  is basically used to authorize the user
const jwt=require("jsonwebtoken");

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        //third thing it take how many days it will expire
        expiresIn:"30d",

    });
};

module.exports=generateToken;