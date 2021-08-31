import { useEffect } from 'react'
import { useState } from 'react'
import { useStatus } from '../../../../contexts/StatusContext'
import styles from './styles.module.scss'

export function Trackbar(){
  const { index, handleIndex, selectedStatus, handleSelectStatus } = useStatus()
  const [ percentage, setPercentage ] = useState(0)
  const [ finish, setFinish ] = useState(0)
  const maxDuration = 7 * 1000

  useEffect(() => {
    setTimeout(() => { setFinish(true) }, maxDuration)
    setPercentage(100)
  },[maxDuration])

  useEffect(() => {
    if(finish){
      handleIndex('next')
      setFinish(false)
    }
  }, [finish, handleIndex])

  useEffect(() => { console.log(percentage) },[percentage])

  return(
    <div className={styles.track_bar}>
      { selectedStatus.status.map((item, index) => 
        <div className={styles.track_bar_item} key={item._id}>
          <div style={
            { width: `${percentage}%`, transition: `${maxDuration / 1000}s` }}/>
        </div>
      ) }
    </div>
  )
}