import React from 'react'
import { Badge, Card } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';

export default function SimilarProduct({ _id, name, category, pictures }) {
    return (
        <LinkContainer to={`/products/${_id}`} style={{ cursor:"pointer", width:"13rem", margin:"10px"}}>
        
            <Card style={{ width: "20rem", margin:"10px"}} >
                <Card.Img variant='top' className='product-preview-img' src={pictures[0].url} style={{height: "280px", objectFit: "cover", }} />
                <Card.Body>
                    <Card.Title>{name}</Card.Title>
                    <Badge bg="warning" text="dark">
                        {category}
                    </Badge>
                </Card.Body>
            </Card>
    
        </LinkContainer>
      )
}