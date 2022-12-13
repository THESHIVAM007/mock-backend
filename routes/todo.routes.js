const { Router } = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const cors = require("cors")

const { TodoModel} = require("../models/todo.model")
const { UserModel } = require("../models/User.model")

const todoController = Router();

todoController.use(cors())

todoController.get("/", async (req, res) => {  
        console.log(req.body.userId);
    const todos = await TodoModel.find({ userId: req.body.userId })//User.find(req.query)
    console.log(todos);
    res.send(todos)
})


todoController.post("/create", async (req, res) => {

    const newTodo = new TodoModel(req.body)
    console.log(newTodo)
    try {
        await newTodo.save()
        res.send("New todo created")
    }
    catch (err) {
        res.send("something went wrong")
    }
})




todoController.put("/:id",async (req,res)=>{
    const {id} = req.params
    const isEdited = await TodoModel.findOneAndUpdate({_id : id, userId : req.body.userId},req.body)
    if(isEdited){
        res.send("Todo Edited Successfully")
    }
    else{
        res.send("Unable to Edit Note")
    }
})
todoController.delete("/:id", async (req, res) => {
    const { id } = req.params
    const del = await TodoModel.findOneAndDelete({ _id: id, id: req.body.userId })
    

    if (del) {
        res.send("Deleted")
    }
    else {
        res.send("Unable to delete note")
    }
})


module.exports = {
    todoController
}