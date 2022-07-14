import { Row , Col } from "react-bootstrap"

const UserInfo = (props) => {
    return (
        <Row>
            <Col md={2}/>
            <Col md={8}>
                <h1>{props.user.username}</h1>
            </Col>
            <Col md={2}/>
        </Row>
    )
}

export default UserInfo