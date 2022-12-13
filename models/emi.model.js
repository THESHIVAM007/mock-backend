const mongoose = require("mongoose")


const emiSchema = new mongoose.Schema({
    unique: String,
    EMI : {type : String, required : true},
    intamount : {type : String, required : true},
    totalpay : {type : String, required : true}
})

const EmiModel = mongoose.model("emi", emiSchema)



module.exports = {
    EmiModel
}
