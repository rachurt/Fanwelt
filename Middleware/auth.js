const jwt=require('jsonwebtoken');
exports.authCustomer=(req,res,next)=>{
    if(req.header('Authorization').replace('Bearer ', '')){
        const token=req.header('Authorization').replace('Bearer ', '');
        const user=jwt.verify(token,"my token is");
        req.user=user;
        if(req.user=="user"){
            return res.status(400).json("invalid user !")
         }
        
    }else{
        return res.status(400).json({message:'Authorization required'});
    }
   
    next();
}