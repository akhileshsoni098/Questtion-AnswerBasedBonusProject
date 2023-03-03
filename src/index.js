const express = require("express")
const mongoose = require("mongoose")

const multer =  require("multer")
const routes = require("./Routes/route")

const app = express()
app.use(express.json())

app.use(multer.any())

app.router("/",routes)
