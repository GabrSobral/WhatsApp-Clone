import { FaWhatsapp } from 'react-icons/fa'
import styles from './styles.module.scss'
import Loading from 'react-loading'

export function SignButton( { isFilled, isLoading, title = "Entrar" }){
  return(
    <button 
      type='submit' 
      className={styles.button} 
      disabled={!isFilled}
    >
      {isLoading ? (
        <Loading type="spin" width={24} height={24} color="#ffffff"/>
      ) : (
        <>
          <FaWhatsapp size={35} fill='#fff'/>
          {title}
        </>
      )}

    </button>
  )
}