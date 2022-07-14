import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Navigation = (props) => {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">reddit (aliExpress)</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <LinkContainer to={'/'}>
                        <Nav.Link>Threads</Nav.Link>
                    </LinkContainer>

                    {!props.loggedIn && 
                        <LinkContainer to={'/logout'}>
                            <Nav.Link>Logout</Nav.Link>
                        </LinkContainer>
                    }
                    {props.loggedIn && 
                        <LinkContainer to={'/login'}>
                            <Nav.Link>Login</Nav.Link>
                        </LinkContainer>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar >
    )
}

export default Navigation;