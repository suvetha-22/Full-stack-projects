const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const things=require('./route')

const app=express()
app.use(cors())
app.use(bodyParser.json())
app.use("/api",things)

const DB_URI="mongodb://localhost:27017/Order";
const PORT=process.env.PORT||5000;

mongoose.connect(DB_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch(()=>{
    console.log(' Not Connected to MongoDB');
});

app.listen(5000,()=>{
    console.log('Server running on http://localhost:5000');
})

/*const mongoose=require('mongoose')
const express=require('express')
const cors =require('cors')
const bodyParser=require('body-parser')
const things=require('./route');
const app=express()
app.use(express.json())
app.use(bodyParser.json())
app.use(cors())
app.use("/api",things)
const DB_URI="mongodb://localhost:27017/Delivery"
const PORT=process.env.PORT||5000;
mongoose.connect(DB_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>{
    console.log("Connceted");
})
.catch(()=>{
    console.log("not connected");
})
app.listen(5000,()=>{
    console.log("Server running on http://localhost:5000")
})
*/