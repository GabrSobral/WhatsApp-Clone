import { useNavigate } from "react-router-dom";
import { useRooms } from "../../../contexts/RoomsContext";
import { useStatus } from "../../../contexts/StatusContext";
import { DetailSVG } from "../../../images/detail";
import { MessageSVG } from "../../../images/message";
import { StatusSVG } from "../../../images/status";
import api from "../../../services/api";
import { socket } from "../../../services/socket";
import { getToken, removeToken } from "../../../utils/handleToken";
import { parseJwt } from "../../../utils/parseJWT";

import styles from './styles.module.scss'

export function Header(){
  const navigate = useNavigate()
  const { actions } = useStatus()
  const { rooms } = useRooms()

  async function Logout(){
    await api.patch('/users/logout')
    const token = getToken();
    
    if(token)
      socket.emit('imOnline', { 
        user: parseJwt(token).id, 
        status: false,
        rooms: rooms.map(item => item._id)
      })

    removeToken()
    navigate('/Authenticate');
	}

  return(
    <header className={styles.container}>
      <div className={styles.user_img}>
        <img src="https://github.com/GabrSobral.png" alt="Profile image"/>
      </div>
      <div 
        className={styles.options_container} 
        title="Status (not developed yet)"
      >
        <button type='button' onClick={() => {}}>
          <StatusSVG size={24} color="#54656F"/>
        </button>

        <button type='button' title="">
          <MessageSVG size={20} color="#54656F"/>
        </button>

        <button type='button' onClick={() => {}} title="More options"> 
          <DetailSVG size={20} color="#54656F"/>

          <div className={styles.popup_more}>
            <div className={styles.button} onClick={Logout}>
              Disconnect
            </div>
          </div>
        </button>
      </div>
    </header>
  )
}