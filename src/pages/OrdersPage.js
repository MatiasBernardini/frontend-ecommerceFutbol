import React, { useEffect, useState } from "react";
import { Badge, Container, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "../axios";
import Loading from "../components/Loading";
import "./OrdersPage.css";

function OrdersPage() {
    const user = useSelector((state) => state.user);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`/users/${user._id}/orders`)
            .then(({ data }) => {
                setLoading(false);
                setOrders(data);
            })
            .catch((e) => {
                setLoading(false);
                console.log(e);
            });
    }, [user._id]);

    if (loading) {
        return <Loading />;
    }

    if (orders.length === 0) {
        return <h1 className="orders-page-empty-message">No tienes órdenes</h1>;
    }

    return (
        <Container className="orders-page-container">
            <h1 className="orders-page-title">Tus órdenes</h1>
            <Table responsive striped bordered hover className="orders-page-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>
                                <Badge
                                    className={`orders-page-badge ${
                                        order.status === "processing" ? "orders-page-badge-warning" : "orders-page-badge-success"
                                    }`}
                                    text="white"
                                >
                                    {order.status}
                                </Badge>
                            </td>
                            <td>{order.date}</td>
                            <td>${order.total}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default OrdersPage;
