import React, { useState, useEffect } from 'react'
import { Message } from './Types'

type Props = {
    name : string
    socket : WebSocket
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
    Messages: Message[]
}

const MessageInput: React.FC<Props> = ({ name, socket, setMessages, Messages}) => {
    const [ message, setMessage ] = useState<string>('')

    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
    }

    const handleSubmit = () => {
        socket.send(JSON.stringify({
            text: message,
            name: name,
            timestamp: new Date().toLocaleTimeString(),
        }))
    }

    useEffect(()  => {
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            const {text, name, timestamp} = data
            console.log(name)
            console.log(timestamp)
            setMessages([
                ...Messages,
                {
                    name : name,
                    content: text,
                    time: timestamp
                }
            ])
        }
    })

    return (
        <div>
            <div className="inputForm">
                <div className="inner">
                    <input
                        type="text"
                        className="input"
                        value={message}
                        onChange={handleInputChange}
                    />
                    <button onClick={handleSubmit} className="btn is-primary">送信</button>
                </div>
            </div>
        </div>
    )
}

export default MessageInput

