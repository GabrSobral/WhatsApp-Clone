// import { MdSearch } from 'react-icons/md'
import styles from './styles.module.scss'

type Props = {
  value: string;
  setSearch: (value: string) => void;
  placeholder: string
}

export function SearchBar({ value, setSearch, placeholder }: Props){
  return(
    <div className={styles.search_bar}>
      <div>
        {/* <MdSearch size={20} color='#919191'/> */}
        <input
          value={value}
          type='text' 
          placeholder={placeholder}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>  
    </div>
  )
}