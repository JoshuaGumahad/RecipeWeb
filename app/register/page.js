'use client';

import { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import RegisterForm from '../../components/RegisterForm';

export default function Register() {
  const [msg, setMsg] = useState('');

  return (
    <Container fluid className="bg-light min-vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100">
        <Col xs={12} md={6} className="mx-auto">
          <h1 className="text-center mb-5 text-primary">Join RecipeShare</h1>
          <Card>
            <Card.Body>
              <RegisterForm setMsg={setMsg} />
              {msg && <p className="text-center mt-3 text-danger">{msg}</p>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}