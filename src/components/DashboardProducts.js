import React from "react";
import { Table, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDeleteProductMutation } from "../services/appApi";
import "./DashboardProducts.css";
//import Pagination from "./Pagination";

function DashboardProducts() {
    const products = useSelector((state) => state.products);
    const user = useSelector((state) => state.user);
    const [deletProduct, { isLoading, isSuccess }] = useDeleteProductMutation();
    function handleDeleteProduct(id) {
        if (window.confirm("Estas Seguro?")) deletProduct({ product_id: id, user_id: user._id });
    }

    function TableRow({ pictures, _id, name, price }) {
        return (
            <tr>
                <td>
                    <img src={pictures[0].url} className="dashboard-product-preview" />
                </td>
                <td>{_id}</td>
                <td>{name}</td>
                <td>{price}</td>
                <td>
                    <Button onClick={() => handleDeleteProduct(_id, user._id)} disabled={isLoading}>
                        Eliminar
                    </Button>
                    <Link to={`/product/${_id}/edit`} className="btn btn-warning">
                        Editar
                    </Link>
                </td>
            </tr>
        );
    }

    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th></th>
                    <th>ID Producto</th>
                    <th>Nombre Producto</th>
                    <th>Precio Producto</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) =>(
                    <tr>
                        <td>
                            <img src={product.pictures[0].url} className="dashboard-product-preview" />
                        </td>
                        <td>{product._id}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>
                            <Button onClick={()=> handleDeleteProduct(product._id, user._id)} >Eliminar</Button>
                            <Link to={`/product/${product._id}/edit`} className="btn btn-warning">
                                Editar
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default DashboardProducts;