import { Product } from "../models/products.js";

class ProductService {
    getProducts = async (limit, page, sort, query) => {
        const products = await Product.find().limit(limit ?? 10).skip(page ?? 1).sort(sort ?? null).where({query});
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
        console.log(id);
        return deletedProduct;
    }
}

export default new ProductService();