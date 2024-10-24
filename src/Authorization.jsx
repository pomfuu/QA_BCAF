/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './main.css'

const Authorization = () => {
    const [validated, setValidated] = useState(false);
    const [password, setPassword] = useState('');
    const [wrongPassword, setWrongPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if (password === "nasigoreng") {
                setValidated(true);
                localStorage.setItem('isLoggedIn', true); 
                navigate("/input_data"); 
            } else {
                setWrongPassword(true);
            }
        }
    };
      
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ marginTop:'10vw' }}>
          <div className="col-5">
            <p className="fs-1 font2 text-center">QA Login</p>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group className="" controlId="validationCustom01">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button className="btn mt-3 border-0 mx-auto" type="submit" style={{ backgroundColor:"#1E1E1E" }}>Submit Password</Button>
                  {wrongPassword && <p className="mt-2" style={{ color:'red' }}>Wrong Password!</p> }
                  <Form.Control.Feedback>Welcome :D</Form.Control.Feedback>
                </Form.Group>
              </Row>
            </Form>
          </div>
        </div>
      );
}

export default Authorization;
