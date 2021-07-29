import { Chat } from '../../components/Chat/index.js'
import { SideBar } from '../../components/SideBar'
import styles from './styles.module.scss'

export function Main(){
  return(
    <div className={styles.main}>
      <aside>
        <SideBar/>
      </aside>

      <main>
        <Chat/>
      </main>
    </div>
  )
}