import styles from './styles.module.scss'

export function SignInput({
  setData,
  type = 'text',
  data ,
  title,
  bgColor = '#ffffff'
}){
  return(
    <div className={`${styles.container} ${data && styles.is_filled}`}>
      <span style={{ backgroundColor: bgColor }}>{title}</span>
      <input 
      value={data}
        type={type}
        style={{ backgroundColor: bgColor }}
        onChange={
          (event) => { 
            setData(event.target.value); 
        }}/>
    </div>
  )
}