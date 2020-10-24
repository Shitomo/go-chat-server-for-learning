import React from 'react'
import {Message} from './Types'

type Props = {
    Message: Message
}

const MessageItem: React.FC<Props> = ({Message}) => {

    return (
        <div className="container">
            <p className="name">{Message.name}</p>
            <p className="content">{Message.content}</p>
            <p className="timestamp">{Message.time}</p>
        </div>
    )
}

export default MessageItem