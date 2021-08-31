import { FaArrowLeft } from 'react-icons/fa'
import { useStatus } from '../../../contexts/StatusContext'
import styles from './styles.module.scss'
import { Trackbar } from './TrackBar'

export function HeaderSelectedStatus({ index }) {
  const { handleSelectStatus, selectedStatus } = useStatus()

  return(
    <header className={styles.container}>
      <button type='button' onClick={() => handleSelectStatus(null)}>
        <FaArrowLeft size={20} fill="#ffffff"/>
      </button>

      <div className={styles.active_status_container}>
        <div className={styles.active_status_photo}/>
        <div>
          <span>{selectedStatus.owner.name}</span>
          <span>{selectedStatus.status[index].createdAt}</span>
        </div>
      </div>

      <Trackbar/>
    </header>
  )
}