import './Comment.css';
import { useState } from 'react';

import CreateComment from './CreateComment';

const Comment = (props) => {
    const [reply, setReply] = useState(false)
    const [like, setLike] = useState(false)
    const [dislike, setDislike] = useState(false)

    const handlePassCreateData = (text, commentID) => {
        props.handleFormSubmit(text, commentID)
    }

    const handleLikeClick = () => {
        if (!like) {
            props.handleCommentVote(props.comment.id, "like")
            if (dislike) {
                handleDislikeClick()
            }
        }
        else {
            props.handleCommentVote(props.comment.id, "dislike")
        }

        setLike(!like)
    }

    const handleDislikeClick = () => {
        if (!dislike) {
            props.handleCommentVote(props.comment.id, "dislike")
            if (like) {
                handleLikeClick()
            }
        }
        else {
            props.handleCommentVote(props.comment.id, "like")
        }

        setDislike(!dislike)
    }

    return (
        <div
            key={`comment ${props.comment.id}`} 
            style={{paddingLeft: props.comment.depth*40 + "px "}}
        >
            <p>{props.comment.text}</p>
            <p>{props.comment.upvotes}</p>
            <p>{props.comment.date_created}</p>
            <button 
                style={like ? {border:'1px solid red'} : {}}
                onClick={() => handleLikeClick()}
            >Like</button>
            <button
                onClick={() => handleDislikeClick()}
                style={dislike ? {border:'1px solid red'} : {}}
            >Dislike</button>
            <button onClick={() => props.handleDeleteComment()}>Delete</button>
            <button onClick={() => setReply(!reply)}>Comment</button>
            {reply &&
            <CreateComment 
                commentID={props.comment.id} 
                handleFormSubmit={handlePassCreateData}
            />}
        </div>
    );
}

export default Comment;
