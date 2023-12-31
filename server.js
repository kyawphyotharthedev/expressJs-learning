const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors');
// const logEvents = require('./middleware/logEvents');
const {logger} = require('./middleware/logEvents');

const PORT = process.env.PORT || 3500;

//cors = Cross Origin Resource Sharing

app.use(cors());
// custom logger
app.use(logger);
// app.use((req,res,next)=>{
//     logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqLogs.txt');
//     console.log(`${req.method}\t${req.path}`);
//     next();
// })

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'/public')));

app.get("/$|index(.html)?", (req, res) => {
  // res.send("Hello World");
  // res.sendFile('./views/index.html',{ root:__dirname});
  res.sendFile(path.join(__dirname,'views','index.html'));
});

app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname,'views','new-page.html'));
});

app.get("/old-page(.html)?", (req, res) => {
  res.redirect('/new-page.html');
});

//route handler
app.get('/hello(.html)',(req,res,next)=>{
  console.log("attempted to load hello.html");
  next()
},(req,res)=>{
  res.send('Hello World');
})

//chaining route handler
const one = (req,res,next)=>{
    console.log('One');
    next();
}

const two = (req,res,next)=>{
  console.log('Two');
  next();
}

const Three = (req,res)=>{
  console.log('Three');
  res.send("finished")
}

app.get('/chain(.html)?',[one,two,Three]);


app.get('/*',(req,res)=>{
  res.status(404).sendFile(path.join(__dirname,'views','404.html'))
})

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
