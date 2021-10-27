import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import {Home} from './components/Home';
import { Login } from './components/Login'
import { Signup } from './components/SignUp'
import { NotFound } from './components/NotFound'
import { AddProducts } from './components/AddProducts'
import { Orders } from './components/Orders';
import { Cart } from './components/Cart'
import { Bill } from './components/Bill';
import { AdminOrders } from './components/AdminOrders';
import { Sales } from './components/Sales';

export const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component = {Home}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/login" component={Login}/>
        <Route path="/add-products" component={AddProducts}/>
        <Route path="/cart" component={Cart}/>       
        <Route path="/user" component={Orders} />
        <Route path="/bill/:billID" component={Bill} />
        <Route path="/admin/orders" component={AdminOrders} />
        <Route path="/admin/sales" component={Sales} />
        <Route component={NotFound}/>        
      </Switch>
    </BrowserRouter>
  )
}

export default App
 