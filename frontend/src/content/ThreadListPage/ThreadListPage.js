import { useState , useEffect } from 'react'
import CONSTANTS from "../../modules/CONSTANTS.json"
import { getRequest , postRequest , putRequest } from '../../modules/requests'
import Thread from '../../components/Thread/Thread'
import CreateThread from '../../components/Thread/CreateThread'

const ThreadListPage = (props) => {
    const [threads, setThreads] = useState([]);
    const [threadChange, setThreadChange] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    
    // TODO add post sorting
    // TODO add get username of thread

    useEffect(() => {
        const address = `${CONSTANTS.INTERFACE_API_LOCATION}thread/all`
        getRequest(address)
            .then((res) => {
                setThreads(res.data)
                setIsLoaded(true)
            })
    }, [threadChange])

    const handleVote = (id, vote) => {
        const address = `${CONSTANTS.INTERFACE_API_LOCATION}thread/votes/${id}`
        const body = JSON.stringify({
            type: vote
        })
        putRequest(address, body).then(res => setThreadChange(!threadChange))
    }

    const handleCreateThread = (title, text) => {
        const address = `${CONSTANTS.INTERFACE_API_LOCATION}thread/`
        const body = JSON.stringify({
            title: title,
            text: text
        })

        postRequest(address, body).then(res => setThreadChange(!threadChange))
    }

    const threadArr = []
    if (isLoaded) {
        for (let thread of threads) {
            const row = 
            <Thread 
                thread={thread}
                handleThreadVote={handleVote}
                isSinglePage={false}
            ></Thread>
            
            threadArr.push(row)
        }
    }

    return (
        <div>
            {isLoaded && 
                <div>
                    <CreateThread handleFormSubmit={handleCreateThread}></CreateThread>
                    {threadArr}
                </div>
            }
        </div>
    )
}

export default ThreadListPage