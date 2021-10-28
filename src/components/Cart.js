import React,{useState, useEffect} from 'react'
import {Navbar} from './Navbar'
import {auth,fs} from '../firebase/index'
import { CartProducts } from './CartProducts';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from './Modal';

toast.configure();

export const Cart = () => { 
    
    // show modal state
    const [showModal, setShowModal]=useState(false);
    const [user, setUser]=useState(null);
    const [userName, setUserName] = useState('');
    // trigger modal
    const triggerModal=()=>{
        setShowModal(true);
    }

    // hide modal
    const hideModal=()=>{
        setShowModal(false);
    }
         
    // getting current user function

    useEffect(()=>{
        const subs = auth.onAuthStateChanged(user=>{
            if(user){
                fs.collection('users').doc(user.uid).get().then(snapshot=>{
                    setUserName(snapshot.data().FullName);
                })
                setUser(user);
                fs.collection('Cart ' + user.uid).onSnapshot(snapshot=>{
                    const newCartProduct = snapshot.docs.map((doc)=>({
                        ID: doc.id,
                        ...doc.data(),
                    }));
                    setCartProducts(newCartProduct);                    
                })
                fs.collection('Cart ' + user.uid).onSnapshot(snapshot=>{
                    const qty = snapshot.docs.length;
                    setTotalProducts(qty);
                })
            }
            else{
                setUser(null);
            }
        })
        return () => subs;
    },[])

    
    // state of cart products
    const [cartProducts, setCartProducts]=useState([]);

    
    // getting the qty from cartProducts in a seperate array
    const qty = cartProducts.map(cartProduct=>{
        return cartProduct.qty;
    })

    // reducing the qty in a single value
    const reducerOfQty = (accumulator, currentValue)=>accumulator+currentValue;

    const totalQty = qty.reduce(reducerOfQty,0);


    // getting the TotalProductPrice from cartProducts in a seperate array
    const price = cartProducts.map((cartProduct)=>{
        return cartProduct.TotalProductPrice;
    })

    // reducing the price in a single value
    const reducerOfPrice = (accumulator,currentValue)=>accumulator+currentValue;

    const totalPrice = price.reduce(reducerOfPrice,0);
    const totalWithGST = (totalPrice+totalPrice*(((Number)(process.env.REACT_APP_CGST) + (Number)(process.env.REACT_APP_SGST))/100)).toFixed(2);
    // global variable
    let Product;
    
    // cart product increase function
    const cartProductIncrease=(cartProduct)=>{
        Product=cartProduct;
        Product.qty=Product.qty+1;
        Product.TotalProductPrice=Product.qty*Product.price;
        // updating in database
            if(user){
                fs.collection('Cart ' + user.uid).doc(cartProduct.ID).update(Product).then(()=>{
                    console.log('incrementing...');
                })
            }
            else{
                console.log('user is not logged in to increment');
            }

    }

    // cart product decrease functionality
    const cartProductDecrease =(cartProduct)=>{
        Product=cartProduct;
        if(Product.qty > 1){
            Product.qty=Product.qty-1;
            Product.TotalProductPrice=Product.qty*Product.price;
             // updating in database
                if(user){
                    fs.collection('Cart ' + user.uid).doc(cartProduct.ID).update(Product).then(()=>{
                        console.log('decrementing...');
                    })
                }
                else{
                    console.log('user is not logged in to decrement');
                }

        }
    }

     // state of totalProducts
     const [totalProducts, setTotalProducts]=useState(0);
     // getting cart products   
  
    
    return (
        <>
            <Navbar user={userName} totalProducts={totalProducts} />           
            <br></br>
            {cartProducts.length > 0 && (
                <div className='container-fluid'>
                    <h1 className='text-center'>Cart</h1>
                    <div className='products-box'>
                        <CartProducts cartProducts={cartProducts}
                           cartProductIncrease={cartProductIncrease}
                           cartProductDecrease={cartProductDecrease}
                        />
                    </div>
                    <div className='summary-box'>
                        <h5>Cart Summary</h5>
                        <br></br>
                        <div>
                        Total No of Products: <span>{totalQty}</span>
                        </div>
                        <div>
                        Total Price: <span>₹ {totalPrice}</span>
                        </div>
                        <div>
                        Total (inc. {((Number)(process.env.REACT_APP_CGST) + (Number)(process.env.REACT_APP_SGST))}% GST) : <span>₹ {totalWithGST}</span>
                        </div>
                        <br></br>

                        <button className='btn btn-secondary btn-md' 
                        onClick={()=>triggerModal()}>Cash on Delivery</button>                                                                                                                                             
                    </div>                                    
                </div>
            )}
            {cartProducts.length < 1 && (
                <div className='container-fluid' style={{textAlign:'center', fontWeight:200,fontSize:50}}>Your Cart is Empty</div>
            ) }

            {showModal===true&&(
                <Modal TotalPrice={totalWithGST} totalQty={totalQty}
                    hideModal={hideModal}
                />
            )}          
                            
        </>
    )
}