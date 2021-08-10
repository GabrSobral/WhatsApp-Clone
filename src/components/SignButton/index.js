import { FaWhatsapp } from 'react-icons/fa'
import styles from './styles.module.scss'
import Loading from 'react-loading'

export function SignButton( { 
  isFilled, 
  isLoading, 
  title = "Entrar", 
  showIcon = true,
  ...rest
}){
  return(
    <button 
      type='submit' 
      className={styles.button} 
      disabled={!isFilled}
      {...rest}
    >
      {isLoading ? (
        <Loading type="spin" width={24} height={24} color="#ffffff"/>
      ) : (
        <>
          {showIcon && <FaWhatsapp size={35} fill='#fff'/>}
          {title}
        </>
      )}

    </button>
  )
}