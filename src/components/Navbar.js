import React, {useState, useCallback, useEffect} from 'react'
import {Link} from 'react-router-dom'
import logo from '../Images/commerce-logo.png'
import {Icon} from 'react-icons-kit'
import {power} from 'react-icons-kit/typicons/power'
import {shoppingCart} from 'react-icons-kit/feather/shoppingCart'
import {userCircle} from 'react-icons-kit/fa/userCircle'
import { home } from 'react-icons-kit/icomoon/home'
import {auth, fs} from '../firebase/index'
import {useHistory} from 'react-router-dom'
import {ic_person} from 'react-icons-kit/md/ic_person'
import {ic_person_add_twotone} from 'react-icons-kit/md/ic_person_add_twotone'
import {ic_settings} from 'react-icons-kit/md/ic_settings'
import {ic_addchart_twotone} from 'react-icons-kit/md/ic_addchart_twotone'
import {ic_event_note} from 'react-icons-kit/md/ic_event_note'

export const Navbar = ({user,totalProducts}) => {

    const history = useHistory();
    const [authorization, setAuthorization] = useState(null);
    const handleLogout=()=>{
        auth.signOut().then(()=>{
            history.push('/login');
        })
    }
    const checkAuthorisation = useCallback((user) => {
        fs.collection('users').doc(user.uid).get().then(snapshot=>{
            setAuthorization(snapshot.data().role==="admin");
        })
    },[]);
    useEffect(() => {
        const subscribe = auth.onAuthStateChanged(user=>{
            if(user){
                checkAuthorisation(user);
                
            }
        })
        return () => subscribe;
    },[checkAuthorisation]);

    return (
        <div className='navbar'>
            <div className='leftside'>
                <div className='logo'>
                    <Link className='navlink' to="/" ><img width="5px" src={logo} alt="logo"/></Link>
                </div>
            </div>
            <div className='rightside'>
                <div><Link className='navlink' to="/"><Icon icon={home} size={20}/>Home</Link></div>

                {!user&&<>
                    <div><Link className='navlink' to="signup"><Icon icon={ic_person_add_twotone} size={20} /> SIGN UP</Link></div>
                    <div><Link className='navlink' to="login"><Icon icon={ic_person} size={20} /> LOGIN</Link></div>
                </>} 
                {user&&<>
                    <div><Link className='navlink' to="/user"><Icon icon={userCircle} size={20}/> Hi, {user}</Link></div>
                    {authorization && <div><Link className='btn btn-success btn-md' to="/admin/sales"><Icon icon={ic_event_note} size={20}/> SALES REPORT</Link></div>}
                    {authorization && <div><Link className='btn btn-success btn-md' to="/admin/orders"><Icon icon={ic_settings} size={20}/> MANAGE ORDERS</Link></div>}
                    {authorization && <div><Link className='btn btn-success btn-md' to="/add-products"><Icon icon={ic_addchart_twotone} size={20} /> ADD PRODUCTS</Link></div>}
                    <div className='cart-menu-btn'>
                        <Link className='navlink' to="cart">
                            <Icon icon={shoppingCart} size={20}/>
                        </Link>
                        <span className='cart-indicator'>{totalProducts}</span>
                    </div>
                    <div className='btn btn-danger btn-md'
                    onClick={handleLogout}><Icon icon={power} size={20}/>LOGOUT</div>
                </>}                     
                                
            </div>
        </div>

    )
}