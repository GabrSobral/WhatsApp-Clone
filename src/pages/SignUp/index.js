import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { SignInput } from '../../components/SignInput';
import { SignButton } from '../../components/SignButton';
import styles from '../SignIn/styles.module.scss'
import { useAuth } from '../../contexts/AuthContext.js';

export default function SignUpPage() {
  const [ name, setName ] = useState('')
  const [ email, setEmail ] = useState('') 
  const [ password, setPassword ] = useState('')
  const [ confirmation, setConfirmation] = useState('')   
  const [ warning, setWarning ] = useState('') 
  const [ isFilled, setIsFilled ] = useState(false) 
  const [ isLoading, setIsLoading ] = useState(false) 

  const { SignUp } = useAuth()
  const history = useHistory()

  useEffect(() => {
    name && email && password && confirmation
    ? setIsFilled(true) : setIsFilled(false)
  },[ name, email, password, confirmation ])

  function handleSetName(value){ setName(value) }
  function handleSetEmail(value){ setEmail(value) }
  function handleSetPassword(value){ setPassword(value) }
  function handleSetConfirmation(value){ setConfirmation(value) }

  async function signUp(event){
    event.preventDefault()

    if(password !== confirmation) {
      return setWarning('As senhas estão incompatíveis')
    }

    setIsLoading(true)
    name.trim()
    email.trim()

    try {
      await SignUp(name, email, password)
      setIsLoading(false)
      history.push('/')
    } catch(error) {
      console.log(error)
      setWarning(error.response.data.error)
      setIsLoading(false)
    }
  }

  return(
    <div className={styles.login_page}>
      <div className={styles.login_form}>
        <span className={styles.title}>Cadastrar-se</span>
        
        <form onSubmit={signUp}> 
          <SignInput
            data={name}
            setData={handleSetName}
            type="text"
            title="Nome:"
          />

          <SignInput
            data={email}
            setData={handleSetEmail}
            type="email"
            title="Email:"
          />

          <SignInput
            data={password}
            setData={handleSetPassword}
            type="password"
            title="Senha:"
          />

          <SignInput
            data={confirmation}
            setData={handleSetConfirmation}
            type="password"
            title="Confirmação de senha:"
          />

          <span className={styles.message}>{warning}</span>

          <SignButton
            isFilled={isFilled}
            isLoading={isLoading}
            title="Cadastrar"
          />
            
        </form> 

        <div className={styles.sign}>
          <Link to='/SignIn'>Já tem uma conta? Clique aqui!</Link>  
        </div>
      </div>
    </div>
  )
}