import { useState , useEffect } from 'react'
import CONSTANTS from "../../modules/CONSTANTS.json"
import { getRequest , putRequest } from '../../modules/requests'
import { useParams } from 'react-router-dom'
import { Row , Col } from 'react-bootstrap'

import UserInfo from '../../components/User/UserInfo'
import UserThreads from '../../components/User/UserThreads'
import UserComments from '../../components/User/UserComments'

const UserPage = (props) => {
    const [threads, setThreads] = useState([]);
    const [user, setUser] = useState([])
    const [comments, setComments] = useState([])
    const [view, setView] = useState("threads")
    const [change, setChange] = useState(false)
    const { userID } = useParams()

    // TODO add post sorting

    useEffect(() => {
        const address = `${CONSTANTS.INTERFACE_API_LOCATION}thread/all/${userID}`
        getRequest(address).then(res => setThreads(res.data))

        const userAddress = `${CONSTANTS.INTERFACE_API_LOCATION}profile/user/${userID}`
        getRequest(userAddress).then(res => setUser(res.data))
    }, [change])

    const handleCommentVote = (id, vote) => {
        const address = `${CONSTANTS.INTERFACE_API_LOCATION}comment/votes/${id}/${vote}`
        const body = JSON.stringify({
        })
        putRequest(address, body).then(res => {
            let index = comments.indexOf(comments.find(e => e.id === id))
            let newComments = [...comments]
            newComments[index] = res.data
            setComments(newComments)
            setChange(!change)
        })
    }

    const handleLoadComments = () => {
        const commentAddress = `${CONSTANTS.INTERFACE_API_LOCATION}comment/user/${user.username}`
        getRequest(commentAddress).then(res => setComments(res.data))
    }

    const handleThreadVote = (id, vote) => {
        const address = `${CONSTANTS.INTERFACE_API_LOCATION}thread/votes/${id}`
        const body = JSON.stringify({
            type: vote
        })
        putRequest(address, body).then(res => setChange(!change))
    }

    return (
        <div>
            <UserInfo user={user}></UserInfo>
            <Row>
                <Col md={2}></Col>
                <Col md={8}>
                    <button onClick={() => setView("threads")}>Threads</button>
                    <button onClick={() => {
                        setView("comments")
                        handleLoadComments()
                    }}
                    >Comments</button>
                </Col>
                <Col md={2}></Col>   
            </Row>
            {view === "threads" &&
            <UserThreads
                user={user} 
                threads={threads}
                handleVote={handleThreadVote}
            ></UserThreads>
            }
            {view === "comments" &&
            <UserComments
                comments={comments}
                handleCommentVote={handleCommentVote}
            ></UserComments>
            }
        </div>
    )
}

export default UserPage