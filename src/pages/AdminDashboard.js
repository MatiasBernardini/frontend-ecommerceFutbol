import React from 'react';
import { Container, Nav, Tab, Col, Row } from "react-bootstrap";
import DashboardProducts from "../components/DashboardProducts";
import OrdersAdminPage from '../components/OrdersAdminPage';
import ClientsAdminPage from '../components/ClientsAdminPage';

function AdminDashboard() {
  return (
    <Container>
      <Tab.Container defaultActiveKey="products">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="products">Productos</Nav.Link> 
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="orders">Órdenes</Nav.Link> 
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="clients">Clientes</Nav.Link> 
              </Nav.Item>
            </Nav>
          </Col>

          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="products">
                <DashboardProducts />
              </Tab.Pane>
              <Tab.Pane eventKey="orders">
                <OrdersAdminPage />
              </Tab.Pane>
              <Tab.Pane eventKey="clients">
                <ClientsAdminPage />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default AdminDashboard;
