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
            <h1>Inicia sesión en tu cuenta</h1>
            {isError && <p style={{ color: 'red' }}>{error.data?.message || 'Error al iniciar sesión'}</p>}
            <Form.Group className="mb-4">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo electrónico"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </Form.Group>
            <p>Si todavía no tienes una cuenta, <Link to="/signup">haz clic aquí</Link> para crear una.</p>
          </Form>
        </Col>
        <Col md={6} className="login__image--container"></Col>
      </Row>
    </Container>
  );
}

export default Login;
