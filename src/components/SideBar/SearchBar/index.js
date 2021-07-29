import { MdSearch } from 'react-icons/md'
import styles from './styles.module.scss'

export function SearchBar({ value, setSearch }){
  return(
    <div className={styles.search_bar}>
      <div>
        <MdSearch size={20} color='#919191'/>
        <input
          value={value}
          type='text' 
          placeholder='Procurar ou começar uma nova conversa' 
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>  
    </div>
  )
}