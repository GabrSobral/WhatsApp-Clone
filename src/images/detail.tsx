type Props = {
  color: string;
  size?: number
}

export const DetailSVG = ({ color, size = 24 }: Props) => {
  return (
    <svg width={size} height={size} viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 3.5C2.82843 3.5 3.5 2.82843 3.5 2C3.5 1.17157 2.82843 0.5 2 0.5C1.17157 0.5 0.5 1.17157 0.5 2C0.5 2.82843 1.17157 3.5 2 3.5Z" fill={color}/>
      <path d="M2 9.5C2.82843 9.5 3.5 8.82843 3.5 8C3.5 7.17157 2.82843 6.5 2 6.5C1.17157 6.5 0.5 7.17157 0.5 8C0.5 8.82843 1.17157 9.5 2 9.5Z" fill={color}/>
      <path d="M2 15.5C2.82843 15.5 3.5 14.8284 3.5 14C3.5 13.1716 2.82843 12.5 2 12.5C1.17157 12.5 0.5 13.1716 0.5 14C0.5 14.8284 1.17157 15.5 2 15.5Z" fill={color}/>
    </svg>
  )
}
