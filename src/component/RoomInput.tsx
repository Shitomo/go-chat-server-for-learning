import React, {useState} from 'react'

type Props = {
    roomName : string
    setRoomName : React.Dispatch<React.SetStateAction<string>>
}

const RoomInput: React.FC<Props> = ({ roomName, setRoomName }) => {
    const [formValue, setFormValue] = useState("")

    const handleFocusout = (e :  React.FocusEvent<HTMLInputElement>) => {
        setRoomName(formValue);
    }

    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setFormValue(e.target.value)
    }
    return (
        <div>
            <div className="inputForm">
                    <p>
                    部屋名    
                    <input
                        type="text"
                        name="room"
                        value={formValue}
                        onChange={handleInputChange}
                        onBlur={handleFocusout}
                    /> 
                    </p>
            </div>
        </div>
    )
}

export default RoomInput