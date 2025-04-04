import React, { useState } from 'react'
import { Alert, Col, Container, Row, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './CartPage.css';
import { useIncreaseCartProductMutation, useDecreaseCartProductMutation, useRemoveFromCartMutation } from "../services/appApi";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe('pk_test_51Qnn1rK9x23RZtHlSmObKXRJTRCEVoc6w3gD7aatWGyeqHhYOoaaNZ5IESwibOlyTNnVS2350ATe1BkOCrhz8MgT00NIS53UD7');

export default function CartPage() {
  const user = useSelector((state) => state.user);
  const products = useSelector((state) => state.products);
  const userCartObj = user.cart;
  let cart = products.filter((product) => userCartObj[product._id] != null);
  const [increaseCart] = useIncreaseCartProductMutation();
  const [decreaseCart] = useDecreaseCartProductMutation();
  const [removeFromCart, {isLoading}] = useRemoveFromCartMutation();

  function handleDecrease(product){
    const quantity = user.cart.count;
    if(quantity <= 0) return alert ("No se puede Continuar");
    decreaseCart(product);
  }

  return (
    <Container style= {{minHeight: "95vh"}} className='cart-container' >
      <Row>
        <Col>
          <h1 className='pt-2 h3'> Carrito </h1>
          {cart.length === 0 ? (
            <Alert variant='info' > El carrito de compras esta vacio, si quiere puede agregar productos </Alert>
          ) : <Elements stripe={stripePromise} >
                <CheckoutForm />
              </Elements>}
        </Col>

        {cart.length > 0 && (
          <Col md={5}>
              <>
                <Table responsive="sm" className="cart-table">
                  <thead>
                    <tr>
                      <th>&nbsp;</th>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cart.map(item => (
                      <tr>
                        <td>&nbsp;</td>
                        <td>
                          {!isLoading && <i className='fa fa-times' style={{marginRight: 10, cursor:"pointer"}} onClick={() => removeFromCart({productId:item._id, price: item.price, userId: user._id})}></i>}
                          <img src={item.pictures[0].url} style={{width: 100, height: 100, objectFit:"cover"}} />
                        </td>

                        <td>${item.price}</td>
                        
                        <td>
                          <span className='quantity-indicator'>
                            <i className='fa fa-minus-circle' onClick={() => handleDecrease({productId:item._id, price: item.price, userId: user._id})} ></i>
                            <span>{user.cart[item._id]}</span>
                            <i className='fa fa-plus-circle' onClick={() => increaseCart({productId:item._id, price: item.price, userId: user._id})} ></i>
                          </span>
                        </td>

                        <td>${item.price * user.cart[item._id]}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div>
                  <h3 className='h4 pt-4'> Total: ${user.cart.total} </h3>
                </div>
              </>
          </Col>
        )}

      </Row>
    </Container>
  )
}
