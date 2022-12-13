const {Router} = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const {authentication} = require("../middlewares/authentication")

const {UserModel} = require("../models/User.model")

const userController = Router();


userController.post("/signup", (req, res) => {
    const {name,email, password} = req.body;
    bcrypt.hash(password, 5, async function(err, hash) {
        if(err){
            res.send("Something went wrong, plz try again later")
        }
        const user = new UserModel({
            name,
            email,
            password : hash,
        })
        try{
            await user.save()
            res.json({msg : "Signup successfull"})
        }
        catch(err){
            console.log(err)
            res.send("Something went wrong, plz try again")
        }
       
    });
})

userController.post("/login", async (req, res) => {
    const {email, password} = req.body;
    const user = await UserModel.findOne({email})
    console.log(user)
    const hash = user.password
    bcrypt.compare(password, hash, function(err, result) {
        if(err){
            res.send("Something went wrong, plz try again later")
        }
        if(result){
            var token = jwt.sign({ email: email }, "secret");
            res.json({message : "Login successfull", token})
        }
        else{
            res.send("Invalid credentials, plz signup if you haven't")
        }
    });
    
})




module.exports = {
    userController
}