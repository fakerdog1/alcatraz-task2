import { useState } from 'react';
import { Row , Col } from 'react-bootstrap';

import Login from '../../components/Login/Login';
import Register from '../../components/Register/Register';

const LoginRegisterPage = (props) => {
    const validActions = ["login", "register"];
    const [action, setAction] = useState("login")
    const [nextAction, setNextAction] = useState("register")

    const toggleAction = () => {
        let index = validActions.indexOf(action);

        index = (index + 1) % validActions.length;
        setAction(validActions[index]);

        index = (index + 1) % validActions.length;
        setNextAction(validActions[index]);
    }

    const registrationComplete = () => {
        setAction(validActions[validActions.indexOf('login')]);
        setNextAction(validActions[(validActions.indexOf('login') + 1) % validActions.length]);
    }

    return (
        <Row>
            <Col md={2}></Col>
            <Col md={8}>
                {(action === "login") &&
                    <Login postLogIn={props.postLogIn}/>
                }
                {(action === "register") &&
                    <Register
                        registrationComplete={registrationComplete}
                        postLogIn={props.postLogIn}
                    /> 
                }
                <br></br>
                <buton onClick={toggleAction}>{nextAction}</buton>
            </Col>
            <Col md={2}></Col>
            
        </Row>
    )
}

export default LoginRegisterPage