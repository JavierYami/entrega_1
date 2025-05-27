import { Schema, model } from "mongoose";

const productSchema = new Schema({
    title: {type: String},
    description: {type: String},
    code: {type: String},
    price: {type: Number},
    status: {type: Boolean},
    stock: {type: Number},
    category: {type: String},
    thumbnails: {type: Array},
})

export const Product = model('Product', productSchema);

