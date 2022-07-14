import { useState , useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getRequest , postRequest, putRequest , deleteRequest } from '../../modules/requests'
import { Row , Col } from 'react-bootstrap'

import CONSTANTS from "../../modules/CONSTANTS.json"

import Thread from '../../components/Thread/Thread'
import Comment from '../../components/Comment/Comment'
import CreateComment from '../../components/Comment/CreateComment'

const ThreadPage = (props) => {
    const [thread, setThread] = useState([]);
    const [comments, setComments] = useState([])
    const [isThreadLoaded, setIsThreadLoaded] = useState(false)
    const [isCommentLoaded, setIsCommentLoaded] = useState(false)
    const { id } = useParams()

    useEffect(() => {
        const threadAddress = `${CONSTANTS.INTERFACE_API_LOCATION}thread/single/${id}`
        getRequest(threadAddress).then((res) => {
            setThread(res.data)
            setIsThreadLoaded(true)
        })
    }, [id, isThreadLoaded])

    useEffect(() => {
        const commentAddress = `${CONSTANTS.INTERFACE_API_LOCATION}comment/thread/${id}`
        getRequest(commentAddress).then((result) => {
            setComments(result.data)
            setIsCommentLoaded(true)
        })
    }, [id, isCommentLoaded])
 
    const handleThreadVote = (id, vote) => {
        const address = `${CONSTANTS.INTERFACE_API_LOCATION}thread/votes/${id}`
        const body = JSON.stringify({
            type: vote
        })
        putRequest(address, body).then(res => setIsThreadLoaded(true))
    }

    const handleCommentVote = (id, vote) => {
        setIsCommentLoaded(false)
        const address = `${CONSTANTS.INTERFACE_API_LOCATION}comment/votes/${id}/${vote}`
        const body = JSON.stringify({
            type: vote
        })
        putRequest(address, body).then(res => setIsCommentLoaded(true))
    }

    const handleDeleteComment = (comment) => {
        setIsCommentLoaded(false)
        const address = `${CONSTANTS.INTERFACE_API_LOCATION}comment/${comment.id}`

        deleteRequest(address).then(res => setIsCommentLoaded(true))
    }

    const handleCreateComment = (text, commentID) => {
        setIsCommentLoaded(false)
        const address = `${CONSTANTS.INTERFACE_API_LOCATION}comment/${thread.id}`
        console.log(commentID)
        const body = JSON.stringify({
            text: text,
            commentID: commentID
        })

        postRequest(address, body).then(res => setIsCommentLoaded(true))
    }

    const objectCommentArr = [] // checking array
    const commentArr = []  // render array
    if (isCommentLoaded) {
        for (let comment of comments) { 
            // check if comment already exists in objectCommentArr (checking array)
            if (!objectCommentArr.some(c => c === comment)) {
                if (comment.depth === 0) {
                    let row = 
                        <Comment
                            comment={comment}
                            handleCommentVote={handleCommentVote}
                            handleFormSubmit={(text) => handleCreateComment(text, comment.commentID)}
                            handleDeleteComment={() => handleDeleteComment(comment)}
                        ></Comment>
    
                    objectCommentArr.push(comment)
                    commentArr.push(row)
                }
                
            }
    
            // check if there are any subcomments which are replies to the comment being checked
            for (let subcomment of comments) {
                if (subcomment.id === comment.id) {
                    continue
                }
                else {
                    if (!objectCommentArr.some(c => c === subcomment)) {
                        if (subcomment.commentID === comment.id && subcomment.depth === comment.depth + 1) {
                            let subRow =
                            <Comment
                                comment={subcomment}
                                handleCommentVote={handleCommentVote}
                                handleFormSubmit={(text) => handleCreateComment(text, subcomment.commentID)}
                                handleDeleteComment={() => handleDeleteComment(subcomment.id)}
                            >
                            </Comment>
        
                            if (comments.indexOf(comment) !== comments.length - 1){ 
                                objectCommentArr.splice(comments.indexOf(comment)+1, 0, subcomment)
                                commentArr.splice(comments.indexOf(comment)+1, 0, subRow)
                            }
                            else {
                                objectCommentArr.push(subcomment)
                                commentArr.push(subRow)
                            }
                            
                        }
                    }
                }
            }    
        }
    }
    

    return (
        <Row>
            <Col md={2} sm={0}></Col>
            <Col md={8} sm={12}>
                {(isThreadLoaded && isCommentLoaded) &&
                <div>
                    <Thread 
                        thread={thread}
                        handleThreadVote={handleThreadVote}
                        isSinglePage={true}
                    ></Thread>
                    <CreateComment handleFormSubmit={handleCreateComment}></CreateComment>
                    {commentArr}
                </div>}
            </Col>
            <Col md={2} sm={0}></Col>
        </Row>
        
    )
}

export default ThreadPage