import React, {useState, useEffect} from 'react';
import logo from '../Images/commerce-logo.png'
import {auth,fs} from '../firebase/index'
import dateFormat from "dateformat";



export const Bill = ({history,match:{params:{billID}}}) => {

    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState("");
    const [order, setOrder] = useState({});
    useEffect(()=>{
        const subs = auth.onAuthStateChanged(user=>{
            if(user){
                fs.collection('users').doc(user.uid).get().then(snapshot=>{
                    setUserName(snapshot.data().FullName);
                    setEmail(snapshot.data().Email);
                    
                });
                fs.collection('Orders '+user.uid).doc(billID).get().then(data => {
                    if(data){
                        setOrder(data.data());
                    }
                })
            }
            else{
                history.push("/");
            }
        })
        return () => subs;
    },[billID, history])
    const totalPrice = order && order.products && order.products.reduce((acc, emm) => ((emm.price*emm.qty)+acc),0);
    return(
        <div>
            <div className="invoice-box">
			<table>
				<tr className="top">
					<td colSpan="3">
						<table>
							<tr>
								<td className="title">
									<img src={logo} alt="Company logo" style={{width:"100%", maxWidth:"300px"}} />
								</td>

								<td>
									Invoice #: {billID}<br />
									Created: {order && order.date && dateFormat(order.date, "dddd, mmmm dS, yyyy")}<br />
                                    Time: { order && order.date && dateFormat(order.date," h:MM:ss TT")} <br/>
									Current Status : { order && order.status}
								</td>
							</tr>
						</table>
					</td>
				</tr>

				<tr className="information">
					<td colSpan="3">
						<table>
							<tr>
								<td>
									eCommerce, Inc.<br />
									XXXXX Sunny Road<br />
									Cateville, TX XXXXX
								</td>
                                
								<td>
									XYZx. Corp.<br />
									{userName && userName.toUpperCase()}<br />
									{email}
								</td>
							</tr>
						</table>
					</td>
				</tr>
            
				<tr className="heading">
					<td>Payment Method</td>
                    <td></td>
					<td></td>
				</tr>

				<tr className="details">
					<td>COD (Cash on Delivery)</td>
                    <td></td>
					<td></td>
				</tr>

				<tr className="heading">
					<td>Item</td>
                    <td>Quantity</td>
					<td>Price</td>
				</tr>

				
                {
                    order && order.products && order.products.map((ord,idx) => (
                        <tr className="item" key={idx}>
                        <td>{ord.title}</td>
                        <td>{ord.qty}</td>
                        <td>₹{ord.price.toFixed(2)}/-</td>
                        </tr>
                    ))
                }


				<tr className="total">
					<td></td>

					<td>TotalAmount :  ₹{totalPrice && totalPrice.toFixed(2)}/-</td>
				</tr>

                <tr className="total">
					<td></td>

					<td>CGST @ 14% :  ₹{totalPrice && (totalPrice*0.14).toFixed(2)}/-</td>
				</tr>
                <tr className="total">
					<td></td>

					<td>SGST @ 14% :  ₹{totalPrice && (totalPrice*0.14).toFixed(2)}/-</td>
				</tr>


                <tr className="total">
					<td></td>

					<td>Total Amount (inc. 28% GST) :  ₹{order && order.totalPrice}/-</td>
				</tr>
			</table>
		</div>
        <div style={{textAlign:"center", margin:'20px'}}><button onClick={ () => {
                window.print()
            }}>PRINT BILL</button></div>
        </div>
    )
}