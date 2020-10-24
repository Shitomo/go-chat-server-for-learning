import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import {Message} from './Types'
import MessageInput from './MessageInput'
import MessageLog from './MessageLog'


type Props = {
  name : string
  socket : WebSocket
}

const initialStateMesssage: Message[] = []
const ChatRoom: React.FC<Props> = ({name, socket}) => {
  const [messages, setMessages] = useState(initialStateMesssage)
  
  if (socket == null) {
    return (
      <div>
        <Link to="/login">
          <p>ログインしてください</p>
        </Link>
      </div>
    )
  }
  else {
    return (
      <div>
          <h4>login user : {name}</h4>
          <MessageInput name={name} socket={socket} setMessages={setMessages} Messages={messages} />
          <MessageLog setMessages={setMessages} Messages={messages} />
      </div>
    )
  }
}

export default ChatRoom
