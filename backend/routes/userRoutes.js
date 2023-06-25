const express=require('express');
const {registerUser,authUser,allUsers} =require("../controllers/userControllers");
const router=express.Router();

const {protect}=require("../middleware/authMiddleware");

router.route('/').post(registerUser).get(protect,allUsers);
//both are the ways of defining it .

router.post('/login',authUser);

module.exports=router;


