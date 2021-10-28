import React,{useState} from 'react'
import {auth,fs} from '../firebase/index'
import {useHistory} from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

export const Modal = ({TotalPrice,totalQty,hideModal}) => {

    const history = useHistory();

    // form states
    const [cell, setCell]=useState(null);
    const [residentialAddress, setResidentialAddress]=useState('');
    const [cartPrice]=useState(TotalPrice);
    const [cartQty]=useState(totalQty);

    // close modal
    const handleCloseModal=()=>{
        hideModal();
    }

    // cash on delivery
    const handleCashOnDelivery=async(e)=>{
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const userData = await fs.collection('users').doc(uid).get();

        const cartData = await fs.collection('Cart ' + uid).get();
        let products= [];
        for(var snap of cartData.docs){
            var data = snap.data();
            products.push(data);
            await fs.collection('Cart ' + uid).doc(snap.id).delete();
        }
        await fs.collection('Orders '+uid).add({products, 
            info:{
            Userid:uid,
            Name: userData.data().FullName,
            Email: userData.data().Email,
            CellNo: cell,
            ResidentialAddress: residentialAddress,
            CartQty: cartQty
            },
            status: "NOT PROCCESSED",
            date: Date.now(),
            totalPrice: cartPrice,
         }).then((data) => {
            console.log(data.id);
        })
        hideModal();
        history.push('/');
        toast.success('Your order has been placed successfully', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
    }

    return (
        <div className='shade-area'>
        <div className='modal-container'>
            <form className='form-group' onSubmit={handleCashOnDelivery}>                   
                <input type="number" className='form-control' placeholder='Cell No'
                    required onChange={(e)=>setCell(e.target.value)} value={cell}                        
                />
                <br></br>
                <input type="text" className='form-control' placeholder='Residential Address'
                    required onChange={(e)=>setResidentialAddress(e.target.value)}
                    value={residentialAddress}
                />
                <br></br>
                <label>Total Quantity</label>
                <input type="text" className='form-control' readOnly
                    required value={cartQty}
                />
                <br></br>
                <label>Total Price (inc. {((Number)(process.env.REACT_APP_CGST) + (Number)(process.env.REACT_APP_SGST))}% GST) :</label>
                <input type="text" className='form-control' readOnly
                    required value={cartPrice}
                />
                <br></br>
                <button type='submit' className='btn btn-success btn-md'>Place Order</button>
            </form>
            <div className='delete-icon' onClick={handleCloseModal}>x</div>
        </div>
    </div>
    )
}