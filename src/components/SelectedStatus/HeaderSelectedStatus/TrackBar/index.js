import { useEffect, useState } from 'react'
import { useStatus } from '../../../../contexts/StatusContext'
import styles from './styles.module.scss'

export function Trackbar(){
  const { index, handleIndex, selectedStatus } = useStatus()
  const [ percentage, setPercentage ] = useState(0)
  const [ finish, setFinish ] = useState(false)
  const maxDuration = 7 * 1000
  
  useEffect(() => { 
    // console.log('percentage: ', percentage)
    console.log('index: ', index)
  },[ index, percentage ])
  
  useEffect(() => {

    setTimeout(() => { setFinish(true) }, maxDuration)
    setPercentage(100)
  },[ maxDuration, index ])

  useEffect(() => {
    if(finish){
      handleIndex('next')
      setFinish(false)
    }
  }, [ finish, handleIndex ])

  return(
    <div className={styles.track_bar}>
      { selectedStatus.status.map((item, i) => {
        return (
          <div className={styles.track_bar_item} key={item._id}>
            <div style={
              { width: `${
                  i < index ? 100 :
                    i === index ? percentage : 0 }%`,
                transition: `${
                  i < index ? 'none' :
                    i === index ? `${maxDuration/1000}s` : 'none'}` }}
            />
          </div>
        )
      }
        
      ) }
    </div>
  )
}