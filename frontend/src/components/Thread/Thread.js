import styles from './Thread.css';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { getRequest } from '../../modules/requests';
import CONSTANTS from '../../modules/CONSTANTS.json'

const Thread = (props) => {
    const [user, setUser] = useState({})
    const [like, setLike] = useState(false)
    const [dislike, setDislike] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const userAddress = `${CONSTANTS.INTERFACE_API_LOCATION}profile/user/${props.thread.ownerID}`
        getRequest(userAddress).then((res) => {
            setUser(res.data)
            setIsLoaded(true)
        })
    }, [props.thread.ownerID, isLoaded])

    const handleLikeClick = () => {
        if (!like) {
            props.handleThreadVote(props.thread.id, "like")
            if (dislike) {
                handleDislikeClick()
            }
        }
        else {
            props.handleThreadVote(props.thread.id, "dislike")
        }

        setLike(!like)
        // props.resetIsLoaded()
    }

    const handleDislikeClick = () => {
        if (!dislike) {
            props.handleThreadVote(props.thread.id, "dislike")
            if (like) {
                handleLikeClick()
            }
        }
        else {
            props.handleThreadVote(props.thread.id, "like")
        }

        setDislike(!dislike)
        setIsLoaded(false)
        // props.resetIsLoaded()
    }

    let render = <div></div>
    if (isLoaded) {
        if (props.isSinglePage) {
            render =
            <div>
                <LinkContainer to={`/user/threads/${props.thread.ownerID}`}>
                    <p>user: {user.username}</p>
                </LinkContainer>
                <div className={styles.thread}>    
                    <h2>{props.thread.title}</h2>
                    <p>{props.thread.text}</p>
                    <p>{props.thread.upvotes}</p>
                    <p>{props.thread.date_created}</p>
                </div>
                <div>
                    <button 
                        style={like ? {border:'1px solid red'} : {}}
                        onClick={() => handleLikeClick()}
                    >Like</button>
                    <button
                        onClick={() => handleDislikeClick()}
                        style={dislike ? {border:'1px solid red'} : {}}
                    >Dislike</button>
                    <button>
                        <Link to="/">Back</Link>
                    </button>
                </div>
            </div>
        }
        else {
            render =
            <div>
                <LinkContainer to={`/user/threads/${props.thread.ownerID}`}>
                    <p>user: {user.username}</p>
                </LinkContainer>
                <LinkContainer to={`/thread/${props.thread.id}`}>
                    <div>
                        <h2>{props.thread.title}</h2>
                        <p>{props.thread.text}</p>
                        <p>{props.thread.upvotes}</p>
                        <p>{props.thread.date_created}</p>
                    </div>
                </LinkContainer>  
                <div>
                    <button 
                        style={like ? {border:'1px solid red'} : {}}
                        onClick={() => handleLikeClick()}
                    >Like</button>
                    <button
                        onClick={() => handleDislikeClick()}
                        style={dislike ? {border:'1px solid red'} : {}}
                    >Dislike</button>
                </div>
            </div>
        }
    }
    

    return (
        
        <div>
            {render}
        </div>
    );
}

export default Thread;
