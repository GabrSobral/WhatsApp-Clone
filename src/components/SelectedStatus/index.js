import styles from './styles.module.scss'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import imageSample from '../../images/Desenho.png'
import { useStatus } from '../../contexts/StatusContext'
import { useState } from 'react'
import { useEffect } from 'react'

export function SelectedStatus(){
  const { selectedStatus } = useStatus()
  const [ index, setIndex ] = useState(0)
  
  function handleIndex(command){
    if(command === "next"){
    
      if(index >= selectedStatus.status.length - 1) { setIndex(0) } 
      else{ setIndex(prevState => prevState + 1) }

    } else {

      if(index <= 0){ setIndex(selectedStatus.status.length - 1) }
      else{ setIndex(prevState => prevState - 1) }
    }
  }
  useEffect(() => { console.log(index) },[index])

  return(
    <div 
      className={styles.container_selected_status}
      style={{ 
        backgroundImage: `url(${imageSample})`, 
        backgroundColor: selectedStatus?.status[index].color }}
    >
      <button type="button" onClick={() => handleIndex('previous')}>
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
            <img src={imageSample} alt="Current Status" />
            <p>{selectedStatus?.status[index].message}</p>
          </>
        ) : (
          <p className={styles.message_without_file}>{selectedStatus?.status[index].message}</p>
        ) }
        
      </div>

      <button 
        type="button" onClick={() => handleIndex('next')}>
        <FaAngleRight size={32} fill="#ffffff"/>
      </button>
    </div>
  )
}