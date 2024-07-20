const router = require('express').Router();
const cloudinary = require('cloudinary');
const fs = require ('fs')
const auth = require('../middlewares/auth.js')
const authAdmin = require('../middlewares/authAdmin.js')


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET_KEY

})


router.post('/upload', auth, authAdmin, (req,res) =>{
    try {
      
        if(!req.files || Object.keys(req.files).length === 0)
        return res.status(400).json({msg: 'No se cargo ningun archivo'})

        const file= req.files.file;

        if(file.size > 1024*1024) {  
            removeTemp(file.tempFilePath)
            return res.status(400).json({msg: 'La imagen es muy grande'})
        }
        if( file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            removeTemp(file.tempFilePath)
            return res.status(400).json({msg: 'Formato de la imagen incorrecto'})
        }
       

        cloudinary.v2.uploader.upload(file.tempFilePath, {folder:"test"},async(error,result)=>{
            if(error) throw error;
            removeTemp(file.tempFilePath)
            res.json({public_id: result.public_id, url: result.secure_url})
        })

        
    } catch (error) {
       return res.status(500).json({msg: error.message})
    }
})

router.post('/destroy', auth, authAdmin, (req,res)=>{
    try {
       const {public_id} = req.body; 
       if(!public_id) return res.status(400).json({msg:'No se selecciono una imagen'})

       cloudinary.v2.uploader.destroy(public_id, async(error, result)=>{
           if(error) throw error;

           res.json({msg: 'La imagen se elimino exitosamente'})
       })
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
})

const removeTemp = (path) =>{
    fs.unlink(path,error =>{
        if(error) throw error;
    })
}

module.exports = router