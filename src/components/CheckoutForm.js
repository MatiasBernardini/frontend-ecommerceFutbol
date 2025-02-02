import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCreateOrderMutation } from '../services/appApi';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState("");
  const [createOrder, { isLoading, isError, isSuccess }] = useCreateOrderMutation();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [paying, setPaying] = useState(false);

  async function handlePay(e) {
    e.preventDefault();
    if (!stripe || !elements || user.cart.count <= 0) return;
    setPaying(true);

    try {
      // Obtener el clientSecret desde el backend
      const { clientSecret } = await fetch('http://localhost:8080/create-payment', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: user.cart.total }),
      }).then((res) => res.json());

      // Confirmar el pago
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      setPaying(false);

      if (error) {
        setAlertMessage(`Error: ${error.message}`);
        return;
      }

      if (paymentIntent) {
        // Crear la orden después de confirmar el pago
        await createOrder({ userId: user._id, cart: user.cart, address, country });

        setAlertMessage(`Pago ${paymentIntent.status}`);
        setTimeout(() => {
          navigate('/orders'); 
        }, 2000);
      }
    } catch (err) {
      setPaying(false);
      setAlertMessage(`Error al procesar el pago: ${err.message}`);
    }
  }

  return (
    <Col md={7} className="cart-payment-container">
      <Form onSubmit={handlePay}>
        <Row>
          {alertMessage && <Alert>{alertMessage}</Alert>}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="First Name" value={user.name} disabled />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" placeholder="Email" value={user.email} disabled />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control type="text" placeholder="Mitre 639" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>País</Form.Label>
              <Form.Control type="text" placeholder="Argentina" value={country} onChange={(e) => setCountry(e.target.value)} required/>
            </Form.Group>
          </Col>
        </Row>

        <label htmlFor="card-element">Tarjeta</label>
        <CardElement id="card-element" />
        <Button className="mt-3" type="submit" disabled={user.cart.count <= 0 || paying || isSuccess}>
          {paying ? "Procesando..." : "Pagar"}
        </Button>
      </Form>
    </Col>
  );
}
