import React, { useState } from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
//mport RoomInput from './component/RoomInput'
//import UserNameInput from './component/UserNameInput'
import ChatRoom from './component/ChatRoom'
import UserInput from './component/UserInput'
let initialStateSocket : WebSocket
const url: string  = `${document.location.protocol.replace("http", "ws")}//localhost:8081/ws?name=`

//<UserNameInput url={url} socket={socket} setSocket={setSocket} setName={setName} />



const App: React.FC = () => {
  const [name, setName] = useState("");
  const [socket, setSocket] = useState(initialStateSocket);

  const LoginPage = () => {
    return (
      <div>
        <UserInput url={url} setSocket={setSocket} setName={setName}/>
      </div>
    )
  }

  const ChatRoomPage = () => {
    return (
      <div>
        <ChatRoom name={name} socket={socket} />
      </div>
    )
  }


  return (
    <div className="App">
        <BrowserRouter>
          <Route path="/login" component={LoginPage} />
          <Route path="/chatroom" component={ChatRoomPage} />
        </BrowserRouter>
    </div>
  )
}

export default App
