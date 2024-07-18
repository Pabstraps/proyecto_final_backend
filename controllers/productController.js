const Products = require('../models/productModel')

//sort, filtering, paginating

class APIfeatures {
    constructor(query,queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
        const queryObj = {...this.queryString}
        console.log({before: queryObj})
        const excludedFields = ['page','sort','limit']
        excludedFields.forEach(el => delete(queryObj[el]))

        console.log({after: queryObj})
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match) // gte: greater than, lt: less than

        this.query.find(JSON.parse(queryStr))
        return this;
    }
    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            console.log(sortBy)
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('createdAt')
        }
        return this;
    }
    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 3
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)

        return this;
    }
}


//CRUD 

const productController = {
    getProducts: async (req,res) =>{
        try {
            const features = new APIfeatures(Products.find(), req.query).filtering().sorting().paginating()
            const products = await features.query

            return res.json({
                status: 'Success',
                result: products.length,
                products
            })
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    createProduct: async (req,res) =>{
        try {
            const {product_id,title,price,description,content,images,category} = req.body;
            if(!images) return res.status(400).json({msg: 'No se subio imagen'})

            const product = await Products.findOne({product_id})
            
            if(product) return res.status(400).json({msg: 'este producto ya existe'})
            
                const newProduct = new Products({
                    product_id, title:title.toLowerCase(), price,description,content,images,category
                })
                await newProduct.save()
                return res.json({msg:'Se ha creado el producto exitosamente'})
            
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    deleteProduct: async (req,res) =>{
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({msg:'Se ha borrado el producto'})
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    updateProduct: async (req,res) =>{
        try {
            const {product_id,title,price,description,content,images,category} = req.body;
            if(!images) return res.status(400).json({msg:'No se subio imagen'})
            await Products.findOneAndUpdate({_id: req.params.id},{
                product_id, tittle:title.toLowerCase(), price,description,content,images,category
        })
        return res.json({msg: 'Producto Actualizado'})

        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },


}


module.exports = productController