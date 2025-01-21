import React, { useState } from 'react'
import { Button, Col, Container, Form, Row, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import "./Signup.css";
import { useSignupMutation } from '../services/appApi';

function Signup() {
    const [name, setName] = useState ("");
    const [email, setEmail] = useState ("");
    const [password, setPassword] = useState ("");
    const [signup, {error, isLoading, isError}] = useSignupMutation();

    function handleSignup(e){
        e.preventDefault();
        signup({ name, email, password });
    };

    return (
        <Container>
            <Row>
                <Col md={6} className='signup__form--container'>
                    <Form style={{width: "100%"}} onSubmit={handleSignup} >

                        <h1> Crea tu Cuenta </h1>
                        {isError && <Alert variant="Danger">{error.data}</Alert>}

                        <Form.Group className="mb-4">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" placeholder="Nombre" value={name} required onChange={(e)=> setName(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Correo Electronico</Form.Label>
                            <Form.Control type="email" placeholder="Email" value={email} required onChange={(e)=> setEmail(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" placeholder="Contraseña" value={password} required onChange={(e)=> setPassword(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3"> 
                            <Button type="submit" disabled={isLoading}>Crear Cuenta</Button>
                        </Form.Group>

                        <p>Si todavia no tiene una cuenta creada, en esta pagina podra crearla</p>
                    </Form>
                </Col>
                <Col md={6} className="signup__image--container"></Col>
            </Row>
        </Container>
    )
}

export default Signup