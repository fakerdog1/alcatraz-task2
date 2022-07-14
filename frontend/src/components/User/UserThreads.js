import { Row , Col } from 'react-bootstrap'

import Thread from '../../components/Thread/Thread'

const UserThreads = (props) => {
    const threadArr = []
    for (let thread of props.threads) {
        const row = 
        <Thread 
            thread={thread}
            handleThreadVote={(id, vote) => props.handleVote(id, vote)}
            isSinglePage={false}
        ></Thread>
        
        threadArr.push(row)
    }

    return (
        <Row>
            <Col md={2}></Col>
            <Col md={8}>
                {threadArr}
            </Col>
            <Col md={2}></Col>
        </Row>
    )
}

export default UserThreads