import fs from 'fs';

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts () {
        try {

            if(!fs.existsSync(this.path)) return [];

            const data = await fs.promises.readFile(this.path, 'utf-8');

            return JSON.parse(data);
        } catch (error) {
            console.error(`Error al obtener los carritos ${error}`);
            return [];
        }
    };


    async addCart () {

        const carts = await this.getCarts();

        const id = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;

        const newCart = {id, products: []};

        carts.push(newCart);

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));

        return newCart;
    }

    async getCartById(id) {

        const carts = await this.getCarts();
    
        const cart = carts.find(cart => parseInt(cart.id) === parseInt(id));

        if(!cart) throw new Error("El carrito no existe")

        return cart.products;
    }

    async addProductToCart (cid, pid) {

        const carts = await this.getCarts();

        const products = await this.getCartById(cid);

        const product = products.find(product => parseInt(product.product) === parseInt(pid))
        
        if(!product) products.push({product: pid, quantity: 1});

        else product.quantity++;

        const index = carts.findIndex(cart => parseInt(cart.id) === parseInt(cid));

        carts[index].products = products;

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));

        return products;
    }
}

export default CartManager;