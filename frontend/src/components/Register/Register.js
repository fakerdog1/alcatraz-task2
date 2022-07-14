import CONSTANTS from './../../modules/CONSTANTS.json';
import { useState } from 'react';
import { postRequest } from './../../modules/requests';

const Register = (props) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const address = `${CONSTANTS.INTERFACE_API_LOCATION}profile/`
        const body = JSON.stringify({
            username: username,
            password: password
        })

        postRequest(address, body).then(data => {
            if (parseInt(data.code) === 201) {
                const address = `${CONSTANTS.INTERFACE_API_LOCATION}auth/login`
                const body = JSON.stringify({
                    username: username,
                    password: password
                })

                postRequest(address, body).then(res => {
                    if (parseInt(res.code) === 200) {
                        console.log(res)
                        props.postLogIn()
                        // window.location.replace("/")
                    }
                    if (parseInt(res.code) === 403) {
                        console.log("Error logging in")
                    }
                });
            }
        })
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
                        onChange={e => setPassword(e.target.value.trim())}
                    />
                </div>
                <br />
                    <button
                        onClick={handleFormSubmit}
                    >
                        Submit
                    </button>
            </form>
        </div>
    )
}
export default Register