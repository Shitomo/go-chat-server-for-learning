import React, { useState } from 'react'
import {Link} from 'react-router-dom'

type Props = {
    url : string
    setSocket : React.Dispatch<React.SetStateAction<WebSocket>>
    setName : React.Dispatch<React.SetStateAction<string>>
}

const UserInput: React.FC<Props> = ({ url, setSocket, setName}) => {
    const [formName, setFormName] = useState("")
    const [formRoomName, setFormRoomName] = useState("")


    const handleNameInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setFormName(e.target.value)
    }

    const handleRoomInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setFormRoomName(e.target.value)
    }

    const handleSubmit = () => {
        setSocket(new WebSocket(url + `${formName}&roomName=${formRoomName}`))
        setName(formName)
    }
    return (
        <div>
            <div className="inputForm">
                <div className="inner">
                    <form action="/roomMake" method="get" >
                    <p>
                    ユーザー名    
                    <input
                        type="text"
                        className="input"
                        value={formName}
                        onChange={handleNameInputChange}
                    />
                    </p>
                    <p>
                    部屋名 
                    <input
                        type="text"
                        className="input"
                        value={formRoomName}
                        onChange={handleRoomInputChange}
                    />
                    </p>

                    <Link to="/chatroom">
                        <input type="submit" value="ログイン" onClick={handleSubmit} className="btn is-primary"/>
                    </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UserInput