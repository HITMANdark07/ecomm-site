
import React from 'react'
import { CartProduct } from './CartProduct'

export const CartProducts = ({cartProducts,cartProductIncrease,
    cartProductDecrease}) => {
    return cartProducts.map((cartProduct)=>(
        <CartProduct key={cartProduct.ID} cartProduct={cartProduct}
           cartProductIncrease={cartProductIncrease}
           cartProductDecrease={cartProductDecrease}
        />
    ))
}