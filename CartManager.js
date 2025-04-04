const  fs = require('fs');

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


    async addCart (products) {

        const carts = await this.getCarts();

        const id = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;

        const newCart = {id, products};

        carts.push(newCart);

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));

        return newCart;
    }

    async getCartById (id) {
        const carts = await this.getCarts();

        const cart = carts.find(cart => parseInt(cart.id) === parseInt(id));

        if(!cart) throw new Error('El carrito no existe');

        return cart;
    }






}

module.exports = CartManager;