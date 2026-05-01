const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://??");
  } catch (err) {
    console.log(err, "error while connecting to the database");
  }
};

const userschema = new mongoose.Schema({
  username: String,
  password: String
});
//swipeschema
const swipeschema = new mongoose.Schema({
    fromUser:{
        type:mongoose.Schema.ObjectId,
        ref:"users"
    },
    toUser:{
        type:mongoose.Schema.ObjectId,
        ref:"users"
    },
    type:{
        type:String,
        enum:["like","dislike"]

    }
})

const User = mongoose.model("users", userschema);

module.exports = {
  connectDB,
  users: User
};
