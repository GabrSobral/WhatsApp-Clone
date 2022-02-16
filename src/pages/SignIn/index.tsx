import React, { FormEvent, useState } from 'react'
import { Link, useRoutes } from 'react-router-dom'
import { SignButton } from '../../components/SignButton/index';
import { SignInput } from '../../components/SignInput/index';
import { useAuth } from '../../contexts/AuthContext'

import styles from './styles.module.scss'

export const SignIn = () => {
  const [ phoneNumber, setPhoneNumber ] = useState('') 
  const [ warning, setWarning ] = useState('') 
	const [ isLoading, setIsLoading ] = useState(false)

	const { signInOrSignUp } = useAuth();
  // const history = useRoutes()

  async function signIn(event: FormEvent){
		event.preventDefault()
		setIsLoading(true)
		phoneNumber.trim()
		try{
			await signInOrSignUp(phoneNumber);
			setIsLoading(false)
			// history.push('/')
			return
		} catch(error: any){
			console.log(error.response.data)
			setWarning(error.response.data.error)
			setIsLoading(false)
			return
		}
  }
  return(
    <div className={styles.login_page}>
			<div className={styles.login_form}>
				<span className={styles.title}>Sign In</span>
          
        <form onSubmit={signIn}>
          <SignInput
						data={phoneNumber}
						setData={(value: any) => setPhoneNumber(value)}
						type="phoneNumber"
						title="Phone number:"
					/>

          <nav className={styles.remember_and_forgotPassword}>
						<div>
							<input type='checkbox' id={styles.remember}/>
							<label htmlFor={styles.remember}>Remember me</label>
						</div>
						<Link to=''>Forgot Password</Link>
          </nav>

          {warning && <span className={styles.message}>{warning}</span>}
					
					<SignButton
						isFilled={phoneNumber}
						isLoading={isLoading}
						disabled={!phoneNumber}
						title="Sign in"
					/>
        </form> 
        <div className={styles.sign}>
					<Link to='/SignUp'>Do not have an account yet? Click here!</Link>  
        </div>  
      </div>
    </div>
  )
}