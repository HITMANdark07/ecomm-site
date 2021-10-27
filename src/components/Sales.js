import React, { useCallback, useEffect, useState } from 'react';
import {auth, fs} from "../firebase/index";
import _ from 'lodash';
import dateFormat from "dateformat";
// import { OrderProducts } from './OrderProducts';
// import {ic_local_printshop} from 'react-icons-kit/md/ic_local_printshop'
// import Icon from 'react-icons-kit';

export const Sales = ({history}) => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date1, setDate1] = useState(null);
    const [date2, setDate2] = useState(null);
    const [filteredOrders, setFilteredOrders] = useState([]);

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
                                        setOrders((prevOrder) => [...prevOrder,{...snap.data(), id:snap.id} ])
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
    const generateReport = useCallback((d1,d2) => {
        if(d1 && d2){
            let data = _.filter(orders, (ord) => ord.date>d1 && ord.date<d2);
            setFilteredOrders(data);
        }
    },[orders]);

    useEffect(() => {
        generateReport(date1,date2);
    },[date1,date2,generateReport]);
    const handleChange = (e, name) => {
        switch(name){
            case "date1":
                setDate1(new Date(e.target.value).getTime());
                break;
            case "date2":
                setDate2(new Date(e.target.value).getTime());
                break;
            default:
                console.log("invalid");
        }   

    }
    
    const totalSales = orders && orders.reduce((acc, emm) => ((Number)(emm.totalPrice)+acc),0);
    const actualSale = ((totalSales*100)/128).toFixed(2);
    const taxCollected = (totalSales - actualSale).toFixed(2);

    const totalSalesRange = filteredOrders && filteredOrders.reduce((acc, emm) => ((Number)(emm.totalPrice)+acc),0);
    const actualSaleRange = ((totalSalesRange*100)/128).toFixed(2);
    const taxCollectedRange = (totalSalesRange - actualSaleRange).toFixed(2);

    return (
        <div>
        {
            loading && orders.length===0 && (<div className="orders-title"><h3><b>SALES Loading...</b></h3></div>)
        }
        {
            !loading && orders.length===0 && (<div className="orders-title"><h3><b>No Sales Yet:</b></h3></div>)
        }
        {
            !loading && orders.length>0 && (<div className="orders-title"><h3><b>ALL TIME SALES:</b></h3></div>)
        } 

        <div className="sale-head">
            <div className="total-sale">
                <div><h3><b>TOTAL SALES: </b></h3></div>
                <div><h3>₹{actualSale}/-</h3></div>
            </div>
            <div className="total-sale">
            <h3><b>TOTAL TAX COLLECTED: </b></h3>
            <div><h3>₹{taxCollected}/-</h3></div>
            </div>
        </div>
        <div style={{textAlign:'center',marginBottom:"-30px"}}><h5><b>CHECK SALES MANUALLY:</b></h5></div>
        <div className="date-picker">
        <input placeholder="form" onChange={(e) => handleChange(e,"date1")} type="date" id="date-picker-example" className="form-control datepicker"/>
        <input placeholder="form" onChange={(e) => handleChange(e,"date2")} type="date" id="date-picker-example" className="form-control datepicker"/>
        </div>
        <div className="sales-picked">
        <div className="number-sales">
                <div><h5><b>NUMBER OF ORDERS PLACED </b></h5></div>
                <div><h5><b>From {dateFormat(date1, "dddd, mmmm dS, yyyy")} to {dateFormat(date2, "dddd, mmmm dS, yyyy")} :</b></h5></div>
            </div>
            <div className="number-sales"> 
                <div><h3>{filteredOrders.length}</h3></div>
            </div>
            <div className="sales-head">
            <div className="total-sales">
                <div><h3><b>TOTAL SALES: </b></h3></div>
                <div><h3>₹{actualSaleRange}/-</h3></div>
            </div>
            <div className="total-sales">
            <h3><b>TOTAL TAX COLLECTED: </b></h3>
            <div><h3>₹{taxCollectedRange}/-</h3></div>
            </div>
        </div>
        </div>
        </div>
    )
}