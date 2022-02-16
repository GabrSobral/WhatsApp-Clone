import ReactLoading from 'react-loading'
import styles from './styles.module.scss'

export function Loading() {
  return(
    <div className={styles.container}>
      <ReactLoading type="spin" width={32} height={32} color="#42996f"/>
    </div>
  );
}