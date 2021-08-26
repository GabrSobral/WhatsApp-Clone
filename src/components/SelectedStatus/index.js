import styles from './styles.module.scss'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import imageSample from '../../images/background.png'

export function SelectedStatus(){
  return(
    <div 
      className={styles.container_selected_status}
      style={{ backgroundImage: `url(${imageSample})` }}
    >
      <button type="button">
        <FaAngleLeft size={32} fill="#ffffff"/>
      </button>

      <div className={styles.main_element}>
        <img src={imageSample} alt="" />
      </div>

      <button type="button">
        <FaAngleRight size={32} fill="#ffffff"/>
      </button>
    </div>
  )
}