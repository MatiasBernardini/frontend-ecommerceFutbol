import axios from '../axios';
import React, { useEffect, useState } from 'react'
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import { Badge, Button, ButtonGroup, Col, Container, FormSelect, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import SimilarProduct from '../components/SimilarProduct';
import './ProductPage.css'
import { LinkContainer } from 'react-router-bootstrap';
import { useAddToCartMutation } from '../services/appApi';
import ToastMessage from '../components/ToastMessage';

export default function ProductPage() {

    const {id} = useParams();
    const user = useSelector(state => state.user);
    const [product, setProduct] = useState(null);
    const [similar, setSimilar] = useState(null);
    const [addToCart, { isSuccess }] = useAddToCartMutation(); 

    const handleDragStart = (e) => e.preventDefault();
    useEffect(()=>{
        axios.get(`/products/${id}`).then(({data}) => {
            setProduct(data.product);
            setSimilar(data.similar)
        })
    }, [id])


    if(!product){
        return <Loading/>
    }

    const responsive = {
        0: {items:1},
        568: {items: 2},
        1024: {items: 3}
    }

    const images = product.pictures.map((picture) => <img className="product__carousel--image" src={picture.url} onDragStart={handleDragStart}/>)

    let similarProducts = [];
    if(similar){
        similarProducts = similar.map((product, idx) => (
            <div className='item' data-value={idx} >
                <SimilarProduct  {...product} />
            </div>
        ))
    }

  return (
    <Container className='pt-4' style={{position: 'relative'}}>
        <Row>
            <Col lg={6} >
                <AliceCarousel mouseTracking items={images} controlsStrategy='alternate'  />
            </Col>

            <Col lg={6} className='pt-4'>
                <h1>{product.name}</h1>
                <p>
                    <Badge bg='primary' > {product.category} </Badge>
                </p>
                <p className='product__price' > <span>$</span>{product.price} </p>
                <p style={{textAlign: "justify"}} className='py-3' >
                    <strong> Descripción: </strong> {product.description}
                </p>

                {user && !user.isAdmin && (
                    <ButtonGroup style={{width:'90%'}}>
                        <FormSelect size="lg" style ={{width: "40%", borderRadius:"0"}}> 
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </FormSelect>
                        <Button size="lg" onClick={() => addToCart({ userId: user._id, productId: id ,price: product.price, image: product.pictures[0].url })}> Agregar al carrito </Button>
                    </ButtonGroup>
                )}

                {user && user.isAdmin && (
                    <LinkContainer to={`/product/${product._id}/edit`} >
                        <Button size="lg" > Editar producto </Button>
                    </LinkContainer>
                )}
                {isSuccess && <ToastMessage bg="info" title="Añadido al carrito" body={`${product.name} está en tu carrito`} />}
            </Col>
        </Row>

        <div className='my-4'>
            <h2> Productos similares </h2>
            <div className="d-flex justify-content-center aling-items-center flex-wrap">
                <AliceCarousel mouseTracking items={similarProducts} responsive={responsive} controlsStrategy='alternate'/>
            </div>
        </div>

    </Container>
  )
}
