import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import ProductPreview from '../components/ProductPreview';
import './CategoryPage.css';

export default function CategoryPage() {
    const { category } = useParams();
    console.log("Categoría recibida:", category);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setLoading(true);
        axios
          .get(`/products/category/${category}`)
          .then(({ data }) => {
            console.log("Productos recibidos:", data);
            setLoading(false);
            setProducts(data);
          })
          .catch((e) => {
            setLoading(false);
            console.log(e.message);
          });
    }, [category]);
    

    if (loading) {
        return <Loading />;
    }

    const productsSearch = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    let title = '';
    switch (category) {
        case 'camisetasversionjugador':
            title = 'Camisetas Versión Jugador';
            break;
        case 'camisetasversionfanaticos':
            title = 'Camisetas Versión Fanáticos';
            break;
        case 'camisetasretro':
            title = 'Camisetas Retro';
            break;
        case 'all':
            title = 'Todas las Camisetas';
            break;
        default:
            title = 'Categoría no válida';
            break;
    }

    return (
        <div className='category-page-container'>
            <div className={`pt-3 ${category}-banner-container category-banner-container`}>
                <h1 className='text-center'>
                    {title}
                </h1>
            </div>

            <div className='filters-container d-flex justify-content-center pt-4 pb-4'>
                <input type='search' placeholder='Buscar' onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            {productsSearch.length === 0 ? (
                <h1>No hay ningún producto</h1>
            ) : (
                <Container>
                    <Row>
                        <Col md={{ span: 10, offset: 1 }}>
                            <div className='d-flex justify-content-center align-items-center flex-wrap'>
                                {productsSearch.map((product) => (
                                    <ProductPreview key={product.id} {...product} />
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Container>
            )}
        </div>
    );
}
