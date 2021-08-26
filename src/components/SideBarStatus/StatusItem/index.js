import { useStatus } from '../../../contexts/StatusContext'
import styles from './styles.module.scss'

export function StatusItem({ item }){
  const { handleSelectStatus } = useStatus()
  return(
    <button 
      type="button" 
      className={styles.status_item}
      onClick={() => handleSelectStatus(item)}
    >
      <div className={styles.status_preview}/>
      <div>
        <span>{item?.owner.name}</span>
        <span>{item?.status[item.status.length - 1].createdAt}</span>
      </div>
    </button>
  )
} 