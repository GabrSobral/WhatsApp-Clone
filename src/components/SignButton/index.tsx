import styles from './styles.module.scss'
import Loading from 'react-loading'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>  {
  isFilled: boolean;
  isLoading: boolean;
  title?: string;
  showIcon?: boolean;
}

export function SignButton({
  isFilled, 
  isLoading, 
  title = "Entrar", 
  showIcon = true,
  ...rest
}: ButtonProps){
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
          {showIcon && <div/>}
          {title}
        </>
      )}

    </button>
  )
}