import { HeaderStatus } from './HeaderStatus'
import { StatusItem } from './StatusItem'
import styles from './styles.module.scss'

export function SideBarStatus(){
  return(
    <div className={styles.container}>
      <HeaderStatus/>

      <div className={styles.status_container_list}>
        <div className={styles.status_list}>
          <span className={styles.title}>RECENT</span>
          <StatusItem/>
        </div>

        <div className={styles.status_list}>
          <span className={styles.title}>VIEWED</span>
          <StatusItem/>
        </div>
      </div>
    </div>
  )
}