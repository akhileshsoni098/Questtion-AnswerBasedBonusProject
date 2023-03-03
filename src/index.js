const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const routes = require("./Routes/route");
const app = express();
app.use(express.json());
app.use(multer().any());

mongoose.connect(
  "mongodb+srv://Akshay:akshay7798953554@akshaydb.e6tjw4w.mongodb.net/group14Database",
  { useNewUrlParser: true}
)

.then(()=>{
console.log("mongodb is connected")
})
.catch((err)=>{
console.log(err.message)
})
app.use("/", routes);

app.listen(3000,()=>{
    console.log("Application is running on port" || 3000)
})



