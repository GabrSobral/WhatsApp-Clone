import styles from './styles.module.scss'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { useStatus } from '../../contexts/StatusContext'
import { HeaderSelectedStatus } from './HeaderSelectedStatus'

export function SelectedStatus(){
  const { selectedStatus, handleIndex, index } = useStatus()
  
  return(
    <div 
      className={styles.container_selected_status}
      style={{ 
        backgroundImage: `url(${selectedStatus?.status[index].file})`, 
        backgroundColor: selectedStatus?.status[index].color }}
    >
      <div>
        <HeaderSelectedStatus index={index}/>

        <button 
          type="button" 
          onClick={() => handleIndex('previous')}
          className={styles.control}
        >
          <FaAngleLeft size={32} fill="#ffffff"/>
        </button>

        <div 
          className={styles.main_element}
          style={{
            backgroundColor: 
              selectedStatus?.status[index].file ? 
              selectedStatus?.status[index].color : "transparent" }}
        >
          { selectedStatus?.status[index].file ? (
            <>
              <img src={selectedStatus?.status[index].file} alt="Current Status" />
              <p>{selectedStatus?.status[index].message}</p>
            </>
          ) : (
            <p className={styles.message_without_file}>
              {selectedStatus?.status[index].message}
            </p>
          ) }
          
        </div>

        <button 
          type="button" 
          onClick={() => handleIndex('next')}
          className={styles.control}
        >
          <FaAngleRight size={32} fill="#ffffff"/>
        </button>
      </div>

    </div>
  )
}