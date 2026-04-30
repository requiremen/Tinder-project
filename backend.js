const express = require("express");
const {connectDB,users} = require("./db");
const jwt = require("jsonwebtoken");
connectDB();
const bcrypt = require("bcrypt");
const app = express();
const port = 3000;
app.use(express.json());
// signup route
app.post("/signup",async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const alreadyExist = await users.findOne({username:username});
    if(alreadyExist){
        return res.status(400).json({
            msg:"user already exsits"
        })
    }
    
    else{
        const hashedpssword = await bcrypt.hash(password,10);
        const newuser = await users.create({
            username:username,
            password:hashedpssword
        })
        return res.status(200).json({
            msg:"user created succefully",
            userid : newuser._id
        })
    }

    
})
//login route
app.post("/login",async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const findeuser = await users.findOne({username:username});
    if(findeuser && await bcrypt.compare(password,findeuser.password)){
        const token = jwt.sign({
            username:username
        },"secretkey")
        return res.status(200).json({
            token:token,
            msg:"login successfull for user" + " "+ username
        })
    }
    else{
        return res.status(400).json({
            msg:"invalid credentials either username or password is incorrect"
        })
    }
})
//test route for checking the authmiddleware
const { authmiddleware }= require("./authmiddleware");
app.get("/test",authmiddleware,(req,res)=>{
    return res.status(200).json({
        msg:"this is a protected route",
        userid:req.userid,
        username:req.username
    })
})
//getting current logged in user details
app.get("/currentuser",authmiddleware,async (req,res)=>{
    const userid = req.userid;
    try{
         const user = await users.findById(userid).select("-password");
    if(user){
        return res.status(200).json({

            username:user.username
        })
    }
    }catch(err){
        return res.status(500).json({
            msg:"internal server error"
        })
    }

})
//updation logic for user to update there bio and age
app.put("/updateuser",authmiddleware, async (req, res) => {
    const userid = req.userid;
    const bio = req.body.bio;
    const age = req.body.age;
  try {
    const updatedUser = await users.findByIdAndUpdate(
     userid,
     {bio,age},
    
      { new: true }
    ).select("-password");
    if(updatedUser){
        return res.status(200).json({
            username:updatedUser.username,
            bio:updatedUser.bio,
            age:updatedUser.age

        })
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//deleting the user bio and age//add karenge baad me kabhi
//swipe logic route // will have to test the route
app.post("/swipe",authmiddleware,async(req,res)=>{
    const userid = req.userid;
    try{
        const {touserid,type}=req.body;
        if(touserid===userid){
            return res.status(400).json({
                msg:"you cannot swipe yourself"
            })
        }
        const swipe = await swipes.create({
            fromUser:userid,
            toUser:touserid,
            type
        
    })
    return res.status(200).json({
        msg:"swipe saved",
        swipe:swipe
    })
    }catch(err){
        res.status(500).json({
            error: err.message
        })
    }
    
})

app.listen(port,()=>{
    console.log(`app is running on ${port}`)
})
