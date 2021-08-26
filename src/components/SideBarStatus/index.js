import { useStatus } from '../../contexts/StatusContext'
import { HeaderStatus } from './HeaderStatus'
import { StatusItem } from './StatusItem'
import styles from './styles.module.scss'

export function SideBarStatus(){
  const { viewedStatus, recentStatus } = useStatus()

  return(
    <div className={styles.container}>
      <HeaderStatus/>

      <div className={styles.status_container_list}>
        <div className={styles.status_list}>
          <span className={styles.title}>RECENT</span>
          { recentStatus.map(
            item => <StatusItem key={item.owner._id} item={item}/> )}
        </div>

        <div className={styles.status_list}>
          <span className={styles.title}>VIEWED</span>
          { viewedStatus.map(
            item => <StatusItem key={item.owner._id} item={item}/> )}
        </div>
      </div>
    </div>
  )
}