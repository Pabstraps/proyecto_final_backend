const productRepository = require('../repositories/productRepository');

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filtering() {
        const queryObj = { ...this.queryString };
        console.log({ before: queryObj });
        const excludedFields = ['page', 'sort', 'limit'];
        excludedFields.forEach(el => delete queryObj[el]);

        console.log({ after: queryObj });
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match); // gte: greater than, lt: less than

        this.query.find(JSON.parse(queryStr));
        return this;
    }
    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            console.log(sortBy);
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('createdAt');
        }
        return this;
    }
    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 3;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

// CRUD
const productController = {
    getProducts: async (req, res) => {
        try {
            const productQuery = productRepository.getAllProductsQuery();
            const features = new APIfeatures(productQuery, req.query).filtering().sorting().paginating();
            const products = await features.query;

            return res.json({
                status: 'Success',
                result: products.length,
                products
            });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    createProduct: async (req, res) => {
        try {
            const { product_id, title, price, description, content, images, category } = req.body;
            if (!images) return res.status(400).json({ msg: 'No se subió imagen' });

            const product = await productRepository.getProductByProductId(product_id);

            if (product) return res.status(400).json({ msg: 'Este producto ya existe' });

            const newProduct = {
                product_id,
                title: title.toLowerCase(),
                price,
                description,
                content,
                images,
                category
            };
            await productRepository.createProduct(newProduct);
            return res.json({ msg: 'Se ha creado el producto exitosamente' });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            await productRepository.deleteProduct(req.params.id);
            res.json({ msg: 'Se ha borrado el producto' });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    updateProduct: async (req, res) => {
        try {
            const { product_id, title, price, description, content, images, category } = req.body;
            if (!images) return res.status(400).json({ msg: 'No se subió imagen' });
            const updatedProduct = {
                product_id,
                title: title.toLowerCase(),
                price,
                description,
                content,
                images,
                category
            };
            await productRepository.updateProduct(req.params.id, updatedProduct);
            return res.json({ msg: 'Producto Actualizado' });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }
};

module.exports = productController;
