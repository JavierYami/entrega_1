const  fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts () {
        try {

            if(!fs.existsSync(this.path)) return [];

            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {

            console.error(`Error al obtener los productos ${error}`);
            return [];
        }
    }

    async getProductById (id) {

        const products = await this.getProducts();

        const product = products.find(product => parseInt(product.id) === parseInt(id));

        if(!product) throw new Error (`El producto con ID ${id} no existe.`);

        return product;
    }

    async addProduct ({title, description, code, price, status, stock, category, thumbnails}) {

        if(!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
            throw new Error ("Datos incompletos");
        }

        const products = await this.getProducts();

        if(products.some(product => product.code === code)) throw new Error (`El código "${code}" ya existe`);

        const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        const newProduct = {id, title, description, code, price, status, stock, category, thumbnails};

        products.push(newProduct);

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

        return newProduct;
    }
    
    async updateProduct (id, updatedData) {

        const products = await this.getProducts();

        const index = products.findIndex(product => parseInt(product.id) === parseInt(id));

        if(index === -1) throw new Error(`El producto con ID ${id} no existe.`);

        products[index] = {...products[index], ...updatedData};

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

        return products[index];
    }

    async deleteProduct (id) {

        const products = await this.getProducts();

        const updatedProducts = products.filter(product => parseInt(product.id) !== parseInt(id));

        await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts, null, 2));

        return updatedProducts;

    }
}


module.exports = ProductManager;
