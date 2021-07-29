import styles from './styles.module.scss'

export function SignInput({
  setData,
  type = 'text',
  data ,
  title
}){
  return(
    <div className={`${styles.container} ${data && styles.is_filled}`}>
      <span>{title}</span>
      <input 
      value={data}
        type={type}
        onChange={
          (event) => { 
            setData(event.target.value); 
        }}/>
    </div>
  )
}