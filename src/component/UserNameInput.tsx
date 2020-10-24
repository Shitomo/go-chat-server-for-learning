import React, { useState } from 'react'

type Props = {
    userName : string
    setUserName : React.Dispatch<React.SetStateAction<string>>
}

const RoomInput: React.FC<Props> = ({ userName, setUserName }) => {
    const [formValue, setFormValue] = useState("")

    const handleSubmit = () => {

        setUserName(formValue)
    }

    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setFormValue(e.target.value)
    }
    return (
        <div>
            <div className="inputForm">
                    <p>
                    ユーザー名   
                    <input
                        type="text"
                        name="room"
                        value={formValue}
                        onChange={handleInputChange}
                        onSubmit={handleSubmit}
                    /> 
                    </p>
            </div>
        </div>
    )
}

export default RoomInput