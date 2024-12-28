const mongoose=require('mongoose')
const orderthings=new mongoose.Schema({
    OrderId:{
        type:String,
        required:true,
        unique:true,
    },
    Name:{
        type:String,
        required:true,    
    },
    Quantity:{
        type:Number,
        required:true,        
    },
})
const products=mongoose.model("products",orderthings);
module.exports=products;

/*const mongoose=require('mongoose')
const orderschema=new mongoose.Schema({
    OrderID:{
        type:String,
        required:true,
    },
    Name:{
        type:String,
        required:true,
    },
    Quantity:{
        type:String,
        required:true,
    },
    Date:{
        type:Date,
        default:Date.now,        
    },
});
const products=mongoose.model('products',orderschema);
module.exports=products;
*/