const mongoose = require('mongoose')
const express = require('express')
const router = express.Router();
const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authenticate = require('../middlewares/authenticate')

router.post("/register",async (req,res)=>{

  const {username , email , password} = req.body;

  if(!username || !email || !password){
    return res.status(400).json({error:"please fill all the details"})
  }

  try{
    const exist = await User.findOne({email:email});
    if(exist){
      return res.status(400).json({error : "Email already exists"})
    }
    else{
      const user = new User ({ username,email,password});
       await user.save()

      res.status(201).json({message:"user registered successfully"})
      
    }

  }
  catch(err){
    return res.status(400).json({error : "Failed"})

  }

});



router.post('/login',async (req,res)=>{
 const {email ,password} = req.body;

 try{

  if(!email || !password){
    return res.status(400).json({error : "Please fill all fields"})
  }

  const userLogin = await User.findOne({email:email});
  if(userLogin){
    const isMatch = await bcrypt.compare(password,userLogin.password)

    const token = await userLogin.generateToken()

    res.cookie("girishv",token, {
      expires : new  Date(Date.now() + 25892000000),
      httpOnly:true
    });

    if(!isMatch){
      return res.status(400).json({error : "Invalid credentials"})
    }
    else{
      return res.json({message : "user signed in successfully"})
    }
    
  }
  else{
    return res.json({error : "Email does not exists"})
  }
}


 catch(err){
   console.log(err)
 }
 
})


router.get('/about',authenticate,(req,res)=>{
  res.send(req.rootUser)
})

module.exports = router;