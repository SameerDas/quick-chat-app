let mongoose=require("mongoose");

// connection logic
mongoose.connect(process.env.CONN_STRING);

// connection state
let db=mongoose.connection;

db.on('connected',()=>{
  console.log("Db connection successful");
})
db.on('err',()=>{
  console.log("DB connection failed");
})
module.exports=db;