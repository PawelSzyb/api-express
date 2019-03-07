const express = require("express")
const app = express()

const feedRoutes = require("./routes/feed")

app.use("/feed", feedRoutes)

app.listen(3000, console.log('Server started at port 3000'))