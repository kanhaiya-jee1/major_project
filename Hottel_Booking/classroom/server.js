const express = require("express");
const app = express();
const users = require("./routes/user.js");
const post = require("./routes/post.js");
const session = require("express-session");

const sessionOptions = {secret: "mysupersecretstrig", resave: false, saveUninitialized: true };

app.use(session(sessionOptions));

app.get("/register",(req,res) => {
    let {name} = req.query;
    res.send(name);
})

// app.get("/tests",(req,res)=>{
//     res.send("test successful!");
// })

// app.get("/reqcount", (req,res)=> {
//     if (req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`you sent a request ${req.session.count} times`);
// });



app.listen(3000, () => {
    console.log("server is listening to 3000")
});