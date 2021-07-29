import { FaWhatsapp } from 'react-icons/fa'
import styles from './styles.module.scss'

export function SignButton(
  isFilled
){
  return(
    <button 
      type='submit' 
      className={styles.button} 
      disabled={!isFilled}
    >
      <FaWhatsapp size={35} fill='#fff'/>
      Entrar
    </button>
  )
}