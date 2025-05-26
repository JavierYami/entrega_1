import { Schema, model } from "mongoose";

const cartSchema = new Schema({
id: {type: Number},
products: {type: Array}
})

export const Cart = model('Cart', cartSchema);



