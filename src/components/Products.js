import React from 'react'
import {Product} from './Product'

export const Products = ({products,addToCart}) => {

    // console.log(products);
    
    return products.map((individualProduct)=>(
        <Product key = {individualProduct.ID} individualProduct={individualProduct}
           addToCart={addToCart}
        />
    ))
}