import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import categories from '../categories';
import { LinkContainer } from 'react-router-bootstrap';
import './Home.css';
import axios from "../axios";
import { useDispatch, useSelector } from 'react-redux';
import { updateProducts } from '../features/productSlice';
import ProductPreview from '../components/ProductPreview';

function Home() {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products);
  const lastProducts = Array.isArray(products) ? products.slice(0, 8) : [];

  useEffect(() => {
    axios.get('/products').then(({ data }) => dispatch(updateProducts(data)));
  }, [dispatch]);

  console.log("productos:", products);

  return (
    <div>
      <img 
        src="https://templofutbol.vtexassets.com/assets/vtex.file-manager-graphql/images/1f564347-0f8d-43bd-af7d-bf7be54d2541___188dc6f9b03ea2e3a062038eb65ecaa5.jpg" 
        className='home-banner' 
        alt="Banner principal de la tienda" 
      />

      <div className="featured-products-container container mt-4">
        <h2>Últimos Productos</h2>
        <div className="d-flex justify-content-center flex-wrap">
          {lastProducts.map((product) => (
            <ProductPreview key={product._id} {...product} />
          ))}
        </div>

        <div>
          <Link to="/category/all" style={{ textAlign: "right", display: "block", textDecoration: "none" }}>Ver más {">>"}</Link>
        </div>
      </div>

      <div className='sale__banner--container mt-4'>
        <img src='https://i.ytimg.com/vi/4XEI5D-rggs/maxresdefault.jpg' alt="Banner de venta" />
      </div>

      <div className="recent-products-container container mt-4">
        <h2>Categorías</h2>
        <Row>
          {categories.map((category) => (
            <LinkContainer to={`/category/${category.name.toLowerCase()}`} key={category.name}>
              <Col md={4}>
                <div
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${category.img})`,
                    gap: "10px"
                  }}
                  className="category-tile"
                >
                  {category.name}
                </div>
              </Col>
            </LinkContainer>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default Home;
