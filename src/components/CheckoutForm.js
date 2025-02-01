import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCreateOrderMutation } from '../services/appApi';
import { Alert, Col, Form, Row } from 'react-bootstrap';

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState("");
    const [createOrder, {isLoading, isError}] = useCreateOrderMutation();
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");

    function handlePay(e){

    }

  return (
    <Col md={7} className='cart-payment-container'> 
        <Form onSubmit={handlePay} >
            <Row> 
                {alertMessage && <Alert>{alertMessage}</Alert>}
                <Col md={6}> 
                    <Form.Group className="mb-3" >
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type='text' placeholder='First Name' value={user.name} disabled />
                    </Form.Group>
                </Col>
                <Col md={6}> 
                    <Form.Group className="mb-3" >
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='text' placeholder='Email' value={user.email} disabled />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}> 
                    <Form.Group className="mb-3" >
                        <Form.Label>Direccion</Form.Label>
                        <Form.Control type='text' placeholder='Mitre 639' value={address} onChange={(e) => setAddress(e.target.value)} />
                    </Form.Group>
                </Col>    
                <Col md={6}> 
                    <Form.Group className="mb-3" >
                        <Form.Label>Pais</Form.Label>
                        <Form.Control type='text' placeholder='Argentina' value={country} onChange={(e) => setCountry(e.target.value)} />
                    </Form.Group>
                </Col>     
            </Row>

            <label htmlFor="card-element" > Card </label>
            <CardElement id="card-element" />
            
        </Form>
    </Col>
  )
}
