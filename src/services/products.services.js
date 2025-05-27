import { Product } from "../models/products.js";

class ProductService {
    getProducts = async (limit = 10, page = 1, sort = null, query = {}) => {
        
        if (!page || page < 1 ) page = 1;

        if (!limit || limit < 1) limit = 10;

        if (!sort || (sort !== 'asc' && sort !== 'desc')) sort = null;

        let filterQuery = {};
        
        if (query) {
            if (query.category) {
                filterQuery.category = query.category;
            }
            if (query.status !== undefined) {
                filterQuery.status = query.status;
            }
        }

        let productsQuery = Product.find(filterQuery).limit(limit).skip(limit * (page - 1));

        if (sort) {
            productsQuery = productsQuery.sort({price: sort === 'asc' ? 1 : -1});
        }
        
        const totalProducts = await Product.countDocuments(filterQuery);

        const products = await productsQuery;

        const totalPages = Math.ceil(totalProducts / limit);

        return {
            payload: products,
            totalPages: totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page: page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}` : null,
            nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}` : null,
        };
    }

    getAllProducts = async () => {
        const products = await Product.find({});
        return products;
    }

    getProductById = async (id) => {
        const product = await Product.findById(id);
        return product;
    }

    addProduct = async (product) => {
        const newProduct = await Product.create(product);
        return newProduct;
    }

    updateProduct = async (id, product) => {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, {new: true});
        return updatedProduct;
    }

    deleteProduct = async (id) => {
        const deletedProduct = await Product.findByIdAndDelete(id);
        return deletedProduct;
    }
}

export default new ProductService();