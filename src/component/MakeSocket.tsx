import React from 'react'
import {Link} from 'react-router-dom'

const url: string  = `${document.location.protocol.replace("http", "ws")}//localhost:8081/ws?name=`


type Props = {
    userName : string
    setSocket : React.Dispatch<React.SetStateAction<WebSocket>>
}

const MakeSocket: React.FC<Props> = ({ userName, setSocket }) => {

    const handleSubmit = () => {
        setSocket(new WebSocket(url + userName))
    }
    return (
        <div>
            <Link to="/chatroom">
                <input type="submit" value="ログイン" onClick={handleSubmit} className="btn is-primary"/>
            </Link>       
        </div>
    )
}

export default MakeSocket



