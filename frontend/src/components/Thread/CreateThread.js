// import styles from './CreateThread.css';
import { useState } from 'react'

const CreateThread = (props) => {
    const [title, setTitle] = useState()
    const [text, setText] = useState()

    const handleCreateThread = (event) => {
        event.preventDefault()
        props.handleFormSubmit(title, text)
    }
    
    return (
        <form onSubmit={handleCreateThread}>
            <input type="text" value={title} palceholder='Title' onChange={event => setTitle(event.target.value)}></input>
            <input type="text" value={text} palceholder='Text' onChange={event => setText(event.target.value)}></input>
            <input type="submit" name="submit"></input>
        </form>
    );
}

export default CreateThread;