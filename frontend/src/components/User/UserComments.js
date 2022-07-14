import { Row , Col } from 'react-bootstrap'

import Comment from '../Comment/Comment'

const UserComments = (props) => {
    const commentArr = []
    for (let comment of props.comments) {
        const row = 
        <Comment
            comment={comment}
            handleCommentVote={(id, vote) => props.handleCommentVote(id, vote)}
        ></Comment>
        
        commentArr.push(row)
    }

    return (
        <Row>
            <Col md={2}></Col>
            <Col md={8}>
                {commentArr}
            </Col>
            <Col md={2}></Col>
        </Row>
    )
}

export default UserComments