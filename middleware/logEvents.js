const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const express =  require('express');
const app = express();
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");


const logEvents = async (message, logName) => {
  const datetime = `${format(new Date(), "yyMMdd\tHH:mm:ss")}`;
  const logItem = `${datetime}\t${uuid()}\t${message}\n`;
  console.log(logItem);
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (err) {
    console.error(err);
  }
};

const logger = app.use((req,res,next)=>{
        logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqLogs.txt');
        console.log(`${req.method}\t${req.path}`);
        next();
    })

module.exports = { logger ,logEvents};
