import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLoginMutation } from '../services/appApi';
import { useDispatch } from 'react-redux';
import './Signup.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const user = { email, password };
      const result = await login(user).unwrap();
      dispatch({ type: 'user/setUser', payload: result });
    } catch (error) {
      console.error('Failed to login:', error);
    }
  }

  return (
    <Container>
      <Row>
        <Col md={6} className='login__form--container'>
          <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
            <h1>Inicia Sesion en tu Cuenta</h1>
            {isError && <p style={{ color: 'red' }}>{error.data?.message || 'Failed to login'}</p>}
            <Form.Group className="mb-4">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </Form.Group>
            <p>Si todavia no tiene una cuenta creada, <Link to="/signup">toque aqui</Link></p>
          </Form>
        </Col>
        <Col md={6} className="login__image--container"></Col>
      </Row>
    </Container>
  );
}

export default Login;