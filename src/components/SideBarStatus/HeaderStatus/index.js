import styles from './styles.module.scss'

export function HeaderStatus(){
  return(
    <header>
      <div className={styles.my_status_container}>
        <div className={styles.my_status_photo}/>

        <div>
          <span>My Status</span>
          <span>No updates</span>
        </div>
      </div>
    </header>
  )
}