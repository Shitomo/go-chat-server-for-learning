import React from 'react'
import MessageItem from './MessageItem'
import {Message} from './Types'

type Props = {
    Messages: Message[]
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

const MessageLog : React.FC<Props> = ({ Messages, setMessages}) => {

    return (
        <div className="inner">
        { //式の中
            
            Messages.length <= 0 ? 'メッセージログはありません' :
            <ul className="Message-list">
                { Messages.map( Message  => (
                    <MessageItem
                        Message={Message}
                    />
                ))}     
            </ul>
        }
        </div>
        
    )
}

export default MessageLog