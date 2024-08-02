const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const userController = {

    register: async (req,res)=>{

        try {
            const {name, email, password} = req.body;

            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg: "el email ya existe"})
            if(password.lenght < 6)
                return res.status(400).json({msg: "el password debe tener al menos 6 caracteres"})

            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                name,email,password:passwordHash
            })
            await newUser.save();
            const accesstoken = createAccesToken({id: newUser._id})
            const refreshtoken = createRefreshToken({id: newUser._id})
            res.cookie('refreshtoken', refreshtoken, {
                httpObnly:true,
                path:'/user/refresh_token'
            })
            return res.json({accesstoken})

        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    login: async(req,res)=>{
    try {
        const {email,password} = req.body;

        const user = await Users.findOne ({email})
        if(!user) return res.status(400).json({msg: 'el usuario no existe!'})

            const isMatch = await bcrypt.compare(password,user.password)
            if(!isMatch) return res.status(400).json({msg: 'Credenciales incorrectas'})

            const accesstoken = createAccesToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})
                res.cookie('refreshtoken', refreshtoken, {
                    httpObnly:true,
                    path:'/user/refresh_token'
                })
                return res.json({accesstoken})
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
    },
    logout: async (req,res)=>{
    try {
        res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
        res.json({msg: "Session cerrada"})
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
    },
    refreshToken: async (req,res)=>{
        try {
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.status(400).json({msg: 'loguea o registrate'})
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET,(error,user)=>{
                if(error) return res.status(400).json({msg:"loguea o registrate"})
                const accesstoken = createAccesToken({id:user.id})
                return res.json(accesstoken)
        })
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    getUser: async (req,res) =>{
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg: "El usuario no existe"})

               return res.json(user)
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
}

const createAccesToken = (user) =>{
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1d"})
}
const createRefreshToken = (user) =>{
    return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET, {expiresIn: "5d"})
}



module.exports = userController