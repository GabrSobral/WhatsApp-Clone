import { useEffect, useState } from 'react'
import { useStatus } from '../../../../contexts/StatusContext'
import styles from './styles.module.scss'

export function Trackbar(){
  const { index, handleIndex, selectedStatus, handleSelectStatus } = useStatus()
  const [ percentage, setPercentage ] = useState(0)
  const [ finish, setFinish ] = useState(false)
  const maxDuration = 7 * 1000

  useEffect(() => {
    setTimeout(() => { setFinish(true) }, maxDuration)
    setPercentage(100)
  },[maxDuration])

  useEffect(() => {
    if(finish){
      handleIndex('next')
      // setPercentage(0)
      setFinish(false)
    }
  }, [finish, handleIndex])

  useEffect(() => { console.log(percentage, index) },[ percentage, index ])

  return(
    <div className={styles.track_bar}>
      { selectedStatus.status.map((item, i) => 
        <div className={styles.track_bar_item} key={item._id}>
          <div style={
            { width: `${
                i < index ? 100 :
                  i === index ? percentage : 0}%`,
              transition: `${
                i < index ? 'none' :
                  i === index ? maxDuration / 1000 : 'none'}s` }}
          />
        </div>
      ) }
    </div>
  )
}