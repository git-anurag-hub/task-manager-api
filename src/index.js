const express = require("express")
require("./db/mangoose")
const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")

const app = express()
const port = process.env.PORT

// const multer = require('multer')
// const upload = multer({
//     dest:'images',
//     limits:{
//         fileSize:1000000
//     },
//     fileFilter(req,file,cb){
//         if(!(file.originalname.endsWith('.doc') || file.originalname.endsWith('.docx'))){
//             return cb(new Error('Please upload a word doc'))
//         }
//         cb(undefined,true)
//     }
// })

// app.post("/upload" , upload.single('upload'), (req,res)=>{
//     res.send()
// },(error,req,res,next)=>{
//     res.status(400).send({"error" : error.message})
// })


// app.use((req, res , next)=>{
//     res.status(503).send("maintainence")
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=>{
    console.log("port running!! " + port)
})

const Task = require("./models/task")
const User = require("./models/user")

// const main = async ()=>{
//     // const task = await Task.findById("5ec5358334ba0c29a0121832")
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
//     const user = await User.findById("5ec5357234ba0c29a0121830")
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }
// main()
