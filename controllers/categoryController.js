const Category = require('../models/categoryModel.js')

const categoryController = {

    getCategories : async (req,res) =>{
        try {
            const categories = await Category.find()
            res.json(categories)
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    createCategory: async (req,res) =>{
        try {
           const {name} = req.body;
           const category = await Category.findOne({name})
           if(category) return res.status(400).json({msg: 'Esta categoria ya existe'})

            const newCategory = new Category({name})

            await newCategory.save();
            return res.json({msg:'Se ha creado la categoria exitosamente'})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    deleteCategory: async (req,res) =>{
        try {
            await Category.findByIdAndDelete(req.params.id)
            res.json({msg: 'Categoria eliminada exitosamente!'})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    updateCategory: async (req,res) =>{
        try {
            const {name} = req.body;
            await Category.findByIdAndUpdate({_id: req.params.id},{name})
            res.json({msg: 'Categoria actualizada exitosamente!'})
        } catch (error) {
            return res.status(500).json({msg: error.message}) 
        }
    }
}

module.exports = categoryController