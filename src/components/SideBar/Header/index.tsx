import { useNavigate } from "react-router-dom";
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
  const router = useNavigate()
  const { actions } = useStatus()

  async function Logout(){
		await api.patch('/users/logout')
    const token = getToken();
    
    if(token)
      socket.emit('imOnline', { 
        user: parseJwt(token).id, 
        status: false, 
      })

    removeToken()
    router('/SignIn');
	}

  return(
    <header className={styles.container}>
      <div className={styles.user_img}>
        {/* <img src="https://github.com/GabrSobral.png" alt="Profile image"/> */}
        {/* <MdPerson size={24} color="#919191"/> */}
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