const Users = require('../models/userModel')

const authAdmin = async (req,res, next) =>{
    try {
        const user = await Users.findOne({
            _id:req.user.id 
        })
        
        if(user.role === "user")
            return res.status(400).json({msg: "Acceso al contenido de administrador negado"})
            next()
    } catch (error) {
        return res.status(500).json({msg:error.message})
    }
}

module.exports = authAdmin