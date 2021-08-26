import styles from './styles.module.scss'

export function StatusItem(){
  return(
    <button type="button" className={styles.status_item}>
      <div className={styles.status_preview}/>
      <div>
        <span>Name of Person</span>
        <span>today at 7:03 PM</span>
      </div>
    </button>
  )
} 