import React, { useState, useEffect } from 'react';
import './NewProduct.css';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCreateProductMutation } from '../services/appApi';
import { Col, Container, Row } from 'react-bootstrap';
import axios from "../axios";

export default function NewProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imgToRemove, setImgToRemove] = useState(null);
  const navigate = useNavigate();
  const [createProduct, { isError, error, isLoading, isSuccess }] = useCreateProductMutation();

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.cloudinary) {
      const script = document.createElement('script');
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      script.onload = () => console.log('¡Script de Cloudinary cargado!');
      document.body.appendChild(script);
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !description || !price || !category || !images.length) {
      return alert("Por favor, complete todos los campos");
    }
    createProduct({ name, description, price, category, images }).then(({ data }) => {
      if (data.length > 0) {
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    });
  }

  const showWidget = () => {
    if (!window.cloudinary) {
      console.error('El script de Cloudinary no ha sido cargado');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dfhbptyd5',
        uploadPreset: 'upload_cloudinary23',
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setImages((prev) => [...prev, { url: result.info.secure_url, public_id: result.info.public_id }]);
        } else if (error) {
          console.error('Error al subir la imagen:', error);
        }
      }
    );
    widget.open();
  };

  function handleRemoveImg(imgObj) {
    setImgToRemove(imgObj.public_id);
    console.log("Enviando solicitud DELETE con public_id:", imgObj.public_id);

    axios
      .delete(`/images/${imgObj.public_id}/`)
      .then((res) => {
        console.log("Respuesta del servidor:", res);
        if (res.status === 200) {
          setImgToRemove(null);
          setImages((prev) => prev.filter((img) => img.public_id !== imgObj.public_id));
        } else {
          console.error('No se pudo eliminar la imagen:', res.data);
        }
      })
      .catch((e) => {
        console.error('Error al eliminar la imagen:', e.response ? e.response.data : e.message);
        setImgToRemove(null);
      });
  }

  return (
    <Container>
      <Row>
        <Col md={6} className="new-product__form--container">
          <div className="new-product__form">
            <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
              <h1>Crea un Producto</h1>
              {isSuccess && <Alert variant="success">Producto creado con éxito</Alert>}
              {isError && <p style={{ color: 'red' }}>{error?.data?.message || 'Error al crear el Producto'}</p>}
              <Form.Group className="mb-4">
                <Form.Label>Nombre del producto</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresar Nombre del Producto"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Descripción del Producto</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Ingresar descripción del Producto"
                  style={{ height: "100px" }}
                  value={description}
                  required
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Precio ($)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Precio ($)"
                  value={price}
                  required
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Categoría</Form.Label>
                <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="" disabled>-- Selecciona una --</option>
                  <option value="camisetasversionfanaticos">Camisetas versión fanáticos</option>
                  <option value="camisetasversionjugador">Camisetas versión jugador</option>
                  <option value="camisetasretro">Camisetas Retro</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-4">
                <Button type='button' onClick={showWidget}>Subir imagen</Button>
                <div className='images-preview-container'>
                  {images.map((image) => (
                    <div key={image.public_id} className='images-preview'>
                      <img src={image.url} alt="Imagen subida" />
                      {imgToRemove !== image.public_id && <i className="fa fa-times-circle" onClick={() => handleRemoveImg(image)}></i>}
                    </div>
                  ))}
                </div>
              </Form.Group>
              <Form.Group className="mb-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creando...' : 'Crear Producto'}
                </Button>
              </Form.Group>
              <p>Asegúrese de tener todos los datos correctos</p>
            </Form>
          </div>
        </Col>
        <Col md={6} className="new-product__image--container"></Col>
      </Row>
    </Container>
  );
}
