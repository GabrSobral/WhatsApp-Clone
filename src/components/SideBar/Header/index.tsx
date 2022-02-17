// import { 
//   MdDonutLarge, 
//   MdMoreVert, 
//   MdPerson, 
//   MdSpeakerNotes 
// } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useStatus } from "../../../contexts/StatusContext";
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
          {/* <MdDonutLarge size={23} color="#919191"/> */}
        </button>

        <button type='button' title="">
          {/* <MdSpeakerNotes size={23} color="#919191"/> */}
        </button>

        <button type='button' onClick={() => {}} title="More options"> 
          {/* <MdMoreVert size={23} color="#919191"/> */}

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