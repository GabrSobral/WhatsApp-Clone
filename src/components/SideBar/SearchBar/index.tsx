// import { MdSearch } from 'react-icons/md'
import { SearchSVG } from '../../../images/search'
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
        <SearchSVG size={16} color="#54656F"/>
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