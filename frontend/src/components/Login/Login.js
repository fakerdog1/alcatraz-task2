import CONSTANTS from './../../modules/CONSTANTS.json';
import { useState } from 'react';
import { postRequest } from './../../modules/requests';

const Login = (props) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleFormSubmit = (event) => {
        event.preventDefault();

        try {
            const address = `${CONSTANTS.INTERFACE_API_LOCATION}auth/login`
            const body = JSON.stringify({
                username: username,
                password: password
            })

            postRequest(address, body).then(res => {
                if (parseInt(res.code) === 200) {
                    window.location.replace("/")
                    props.postLogIn()
                }
                if (parseInt(res.code) === 403) {
                    console.log("Error logging in")
                }
            });
        } catch {
            console.log("Error");
        }

    }

    return (
        <div>
            <form>
                <div>
                    <label>Username</label>
                    <br />
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value.trim())}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <br />
                    <input
                        value={password}
                        type="password"
                        onChange={e => setPassword(e.target.value.trim())}
                    />
                </div>
                <br />
                <button onClick={handleFormSubmit}>
                    Log In
                </button>
            </form>
        </div>
    )
}
export default Login