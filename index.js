const express = require("express");
const cors = require("cors");
const { userController } = require("./routes/user.routes");
// const {todoController} = require("./routes/todo.routes")
const { connection } = require("./config/db");
const { UserModel } = require("./models/User.model");
const { authentication } = require("./middlewares/authentication");
const { EmiModel } = require("./models/emi.model");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use(cors());

app.use("/user", userController);
app.use(authentication);
app.get("/user/getProfile", async (req, res) => {
  const profile = await UserModel.findOne({ userId: req.body.userId });
  res.send(profile);
});

app.post("/emi/create", async (req, res) => {
  let { loan, interest, tenure } = req.body;
  console.log(req.body)
  // EMI:E = P x r x ( 1 + r )n / ( ( 1 + r )n - 1 )
  interest = (interest/12/100)
  const EMI =
    ((loan * interest * ((1 + interest)** tenure)) / ((1 + interest) ** (tenure - 1))).toFixed(2);
  const totalpay = EMI * tenure;
  const intamount = EMI * tenure - loan;

  const token = req.headers.authorization;
  jwt.verify(token, 'secret', async function (err, decoded) {
      if (err) {
          res.send("Please login to create notes")
      }
      else {
        
        const emidata = new EmiModel({
            EMI,
            intamount,
            totalpay,
            unique: req.body.unique
          });
          console.log(emidata)
            await emidata.save();
            res.json({ msg: "data saved successfull" });
            
              }
  });
});
app.get("/emi/getemi", async (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, "secret", async function (err, decoded) {
    if (err) {
      res.send("Please login to see the notes");
    } else {
    //   const unique = decoded.email;
     
      const data = await EmiModel.find({ email: req.body.unique });
      console.log(data);
      res.send(data);
    }
  });
});
// app.use("/todo", todoController)

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to db");
  } catch (err) {
    console.log("Error connnecting to DB");
    console.log(err);
  }
  console.log(`listening on PORT ${PORT}`);
});
