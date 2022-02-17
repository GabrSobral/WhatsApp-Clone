import styles from './styles.module.scss'

export type ISignInputProps = {
  setData: (value: string) => void;
  type?: "text" | "number" | "email" | "decimal" | "password";
  data: string;
  title: string;
  bgColor?: string;
}

export function SignInput({
  setData,
  type = 'text',
  data ,
  title,
  bgColor = '#ffffff'
}: ISignInputProps){
  return(
    <div className={`${styles.container} ${data && styles.is_filled}`}>
      <span style={{ backgroundColor: bgColor }}>{title}</span>
      <input 
        value={data}
        type={type}
        style={{ backgroundColor: bgColor }}
        onChange={(event) => { setData(event.target.value); }}
      />
    </div>
  )
}