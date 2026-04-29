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

app.listen(port,()=>{
    console.log(`app is running on ${port}`)
})
