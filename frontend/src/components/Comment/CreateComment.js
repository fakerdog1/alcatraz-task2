import './Comment.css';
import { useState } from 'react';

const CreateComment = (props) => {
    const [text, setText] = useState()
    const [ownerID, setOwnerID] = useState()
    
    const handleCreateComment = (event) => {
        event.preventDefault()
        if (props.commentID) {
            props.handleFormSubmit(text, ownerID, props.commentID)
        }
        else {
            props.handleFormSubmit(text, ownerID, null)
        }
    }

    return (
        <div>
            <form onSubmit={handleCreateComment}>
                <input type="text" value={text} palceholder='Text' onChange={event => setText(event.target.value)}></input>
                <input type="text" value={ownerID} palceholder='UserID' onChange={event => setOwnerID(event.target.value)}></input>
                <input type="submit" name="submit" value="Submit"></input>
            </form>
        </div>
    );
}

export default CreateComment;
