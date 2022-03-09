import { ButtonHTMLAttributes } from "react";
import Loading from "react-loading";
import styles from './styles.module.scss';

interface ConfirmButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  isLoading: boolean;
  text: string;
}

export const ConfirmButton = ({text, isLoading, ...rest}: ConfirmButtonProps) => {
  return(
    <button {...rest} className={styles.button}>
      {!isLoading ? text : 
        <Loading type="spin" width={24} height={24} color="#ffffff"/>}
    </button>
  )
}