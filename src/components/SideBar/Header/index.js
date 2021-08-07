import { 
  MdDonutLarge, 
  MdMoreVert, 
  MdPerson, 
  MdSpeakerNotes 
} from "react-icons/md";
import { useAuth } from "../../../contexts/AuthContext";


import styles from './styles.module.scss'

export function Header(){
  const { Logout } = useAuth()
  return(
    <header className={styles.container}>
      <div className={styles.user_img}>
        {/* <img src="https://github.com/GabrSobral.png" alt="Imagem de perfil"/> */}
        <MdPerson size={32} color="#919191"/>
      </div>
      <div className={styles.options_container}>
        <button type='button'>
          <MdDonutLarge size={23} color="#919191"/>
        </button>

        <button type='button'>
          <MdSpeakerNotes size={23} color="#919191"/>
        </button>

        <button type='button' onClick={() => {}}> 
          <MdMoreVert size={23} color="#919191"/>

          <div className={styles.popup_more}>
            <div className={styles.button}type='button' onClick={Logout}>
              Desconectar
            </div>
          </div>
        </button>
      </div>
    </header>
  )
}