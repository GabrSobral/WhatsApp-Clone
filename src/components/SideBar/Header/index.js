import { 
  MdDonutLarge, 
  MdMoreVert, 
  MdPerson, 
  MdSpeakerNotes 
} from "react-icons/md";
import { useHistory } from "react-router-dom";
import { useStatus } from "../../../contexts/StatusContext";
import api from "../../../services/api";
import { socket } from "../../../services/socket";
import { getToken, logout } from "../../../utils/handleToken";
import { parseJwt } from "../../../utils/parseJWT";

import styles from './styles.module.scss'

export function Header(){
  const { push } = useHistory()
  const { handleStatusOpen } = useStatus()

  async function Logout(){
		await api.patch('/users/logout')
    socket.emit('imOnline', { 
      user: parseJwt(getToken()).id, 
      status: false, 
    })
    logout()
    push('/SignIn')
	}

  return(
    <header className={styles.container}>
      <div className={styles.user_img}>
        {/* <img src="https://github.com/GabrSobral.png" alt="Profile image"/> */}
        <MdPerson size={24} color="#919191"/>
      </div>
      <div 
        className={styles.options_container} 
        title="Status (not developed yet)"
        onClick={handleStatusOpen}
      >
        <button type='button'>
          <MdDonutLarge size={23} color="#919191"/>
        </button>

        <button type='button' title="">
          <MdSpeakerNotes size={23} color="#919191"/>
        </button>

        <button type='button' onClick={() => {}} title="More options"> 
          <MdMoreVert size={23} color="#919191"/>

          <div className={styles.popup_more}>
            <div className={styles.button}type='button' onClick={Logout}>
              Disconnect
            </div>
          </div>
        </button>
      </div>
    </header>
  )
}