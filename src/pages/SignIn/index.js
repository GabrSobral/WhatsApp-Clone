import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { SignButton } from '../../components/SignButton/index.js';
import { SignInput } from '../../components/SignInput/index.js';
import { useAuth } from '../../contexts/AuthContext.js'

import styles from './styles.module.scss'

export default function SignInPage() {
  const [ password, setPassword ] = useState('')
  const [ email, setEmail ] = useState('') 
  const [ warning, setWarning ] = useState('') 

	const { SignIn } = useAuth()

  const history = useHistory()

	function handleSetEmail(value){ setEmail(value) }
	function handleSetPassword(value){ setPassword(value) }

  async function signIn(event){
		event.preventDefault()
		email.trim()
		try{
			await SignIn(email, password)
			history.push('/')
		} catch(error){
			setWarning(error.response.data.error)
			setPassword('')
		}
  }
  return(
    <div className={styles.login_page}>
			<div className={styles.login_form}>
				<div className={styles.title}>
					<span>Entrar</span>
				</div>
          
        <form onSubmit={signIn}>
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

          <div className={styles.remember_and_forgotPassword}>
						<div>
							<input type='checkbox' id={styles.remember}/>
							<label htmlFor='remember'>Lembrar-se</label>
						</div>
						<Link to=''>Esqueci minha senha</Link>
          </div>

          {warning && <span className={styles.message}>{warning}</span>}
					
					
					<SignButton
						isFilled={!email && !password ? false : true}
					/>
        </form> 
        <div className={styles.sign}>
					<Link to='/SignUp'>Não tem uma conta? Clique aqui!</Link>  
        </div>  
      </div>
    </div>
  )
}