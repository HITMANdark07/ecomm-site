import React, { useEffect, useState } from 'react';
import {auth, fs} from "../firebase/index";
import _ from 'lodash';
import { OrderProducts } from './OrderProducts';
import {ic_local_printshop} from 'react-icons-kit/md/ic_local_printshop'
import Icon from 'react-icons-kit';

export const AdminOrders = ({history}) => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const subs = auth.onAuthStateChanged(user => {
            if(user){
                fs.collection("users").doc(user.uid).get().then((data) =>{
                    if(data){
                        if(data.data().role==="admin"){
                            console.log("admin");
                        }else{
                            history.push("/")
                        }
                    }else{
                        history.push("/");
                    }
                })
                fs.collection("users").get().then(data => {
                    if(data){
                        for(let snap of data.docs){
                            fs.collection('Orders '+snap.id).get().then(order =>{
                                if(order){
                                    for(let snap of order.docs){
                                    setOrders((prevOrders) => [...prevOrders,{...snap.data(),id:snap.id}]);
                                    }
                                    setLoading(false);
                                }
                            })
                        }
                    }
                })
            }else{
                history.push("/");
            }
        })
        return () => subs;
    },[history]);
    const handleUpdate = (event, userid, ord) => {
        fs.collection("Orders "+userid).doc(ord.id).update({...ord,status: event.target.value}).then(() => {
            window.location.reload();
        })
    }
    const uniqueOrders = _.uniqBy(orders,"date");
    return(
        <div>
        <div className="orders">
        {
            loading && uniqueOrders.length===0 && (<div className="orders-title"><h4><b>Orders Loading...</b></h4></div>)
        }
        {
            !loading && uniqueOrders.length===0 && (<div className="orders-title"><h4><b>No Orderes Yet:</b></h4></div>)
        }
        {
            !loading && uniqueOrders.length>0 && (<div className="orders-title"><h4><b>Manage Orders:</b></h4></div>)
        } 
        {uniqueOrders.map((ord) => (
            <div className="order" key={ord && ord.id}>
            <div className="order-id"><b>ORDER ID: </b>{ord && ord.id && ord.id.toUpperCase()}</div>
            <div className="order-status">
                <span><b>STATUS : </b></span>
                <select value={ord && ord.status} onChange={(e) => handleUpdate(e,ord.info.Userid, ord)}>
                    {ord.status && [
                        "NOT PROCCESSED",
                        "PROCCESSED",
                        "SHIPPED",
                        "ON THE WAY",
                        "DELIVERED",
                        "CANCELED"
                    ].map((stat, idx) => (
                        <option key={idx} >{stat}</option>
                    ))}
                </select>
            </div>
            <div className="order-user"><b>USER : </b>{ord && ord.info && ord.info.Email}</div>
            <div className="order-products">
                {ord && ord.products && ord.products.map((pro,i) => (
                    <OrderProducts key={i} title={pro.title} imgUrl={pro.url} price={pro.price} quantity={pro.qty} />
                ))}
            </div>
            <div className="order-amount"><b>Total Payable Amount (inc. 28% GST)</b>: ₹ {ord.totalPrice}/-</div>
            <div className="print"><button className="print-bill" onClick={() => history.push(`/bill/${ord.id}`)}>
                <span><Icon icon={ic_local_printshop} /></span> PRINT BILL</button></div>
        </div>
        ))}
        </div>
        </div>
    )
}