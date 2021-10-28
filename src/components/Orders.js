import React,{useState, useEffect} from 'react'
import {Navbar} from './Navbar'
import {auth,fs} from '../firebase/index'
import { OrderProducts } from './OrderProducts';
import {ic_local_printshop} from 'react-icons-kit/md/ic_local_printshop'
import Icon from 'react-icons-kit';

export const Orders = ({history}) => {

    const [userName , setUserName] = useState("");
    const [loading,setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    useEffect(() => {
        const subs = auth.onAuthStateChanged(user => {
            if(user){
                fs.collection('users').doc(user.uid).get().then(snapshot=>{
                    setUserName(snapshot.data().FullName);
                })
                fs.collection('Cart ' + user.uid).onSnapshot(snapshot=>{
                    const qty = snapshot.docs.length;
                    setTotalProducts(qty);
                })
                fs.collection('Orders '+user.uid).get().then(orderData => {
                    setLoading(false);
                    const data = orderData.docs.map((doc) => ({
                        ID:doc.id,
                        ...doc.data(),
                    }))
                    setOrders(data);
                })
                
            }else{
                history.push("/");
            }
        })
        return subs;
    },[history])
    return(
        <>
        <Navbar user={userName} totalProducts={totalProducts} />
        <br></br>
        <div className="orders">
        {
            loading && orders.length===0 && (<div className="orders-title"><h4><b>Your Orders Loading...</b></h4></div>)
        }
        {
            !loading && orders.length===0 && (<div className="orders-title"><h4><b>You Not Ordered anything yet.</b></h4></div>)
        }
        {
            !loading && orders.length>0 && (<div className="orders-title"><h4><b>Your Orders:</b></h4></div>)
        }
        {orders.map((ord) => (
            <div className="order" key={ord && ord.ID}>
            <div className="order-id"><b>ORDER ID: </b>{ord&&ord.ID.toUpperCase()}</div>
            <div className="order-status">
                <span><b>STATUS : </b></span>
                <b style={{fontSize:"18px"}}>{ord && ord.status}</b>
            </div>
            <div className="order-products">
                {ord && ord.products && ord.products.map((pro,i) => (
                    <OrderProducts key={i} title={pro.title} imgUrl={pro.url} price={pro.price} quantity={pro.qty} />
                ))}
            </div>
            <div className="order-amount"><b>Total Payable Amount (inc. {(Number)(process.env.REACT_APP_CGST) + (Number)(process.env.REACT_APP_SGST)}% GST)</b>: ₹ {ord.totalPrice}/-</div>
            <div className="print"><button className="print-bill" onClick={() => history.push(`/bill/${ord.ID}`)}>
                <span><Icon icon={ic_local_printshop} /></span> PRINT BILL</button></div>
        </div>
        ))}
        </div>
        </>
    )
};