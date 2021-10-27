import React from "react";

export const OrderProducts = ({title, price,quantity, imgUrl}) => {
    return (
        <div className="order-product">
                    <img alt="alt-new" className="order-product-image"
                    // src="https://www.namm.org/sites/www.namm.org/files_public/styles/1010px/public/Screen%20Shot%202017-09-14%20at%208.13.36%20AM.png?itok=32ow_8f0" 
                    src={imgUrl}
                    />
                     <div className="container">
                        <div className="order-product-name"><h6><b>{title}</b></h6></div>
                        <div className="order-product-quantity"><span><b>Quantity:</b> </span>{quantity}</div>
                        <div className="order-product-price">₹{price}/-</div>
                     </div>
        </div>
    )
}
