import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { SignButton } from '../../components/SignButton/index.js';
import { SignInput } from '../../components/SignInput/index.js';
import { useAuth } from '../../contexts/AuthContext.js'

import styles from './styles.module.scss'

export default function SignInPage() {
  const [ phoneNumber, setPhoneNumber ] = useState('') 
  const [ warning, setWarning ] = useState('') 
	const [ isLoading, setIsLoading ] = useState(false)

	const { SignIn } = useAuth()
  const history = useHistory()

  async function signIn(event){
		event.preventDefault()
		setIsLoading(true)
		phoneNumber.trim()
		try{
			await SignIn(phoneNumber)
			setIsLoading(false)
			history.push('/')
			return
		} catch(error){
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
						setData={(value) => setPhoneNumber(value)}
						type="phoneNumber"
						title="Phone number:"
					/>

          <div className={styles.remember_and_forgotPassword}>
						<div>
							<input type='checkbox' id={styles.remember}/>
							<label htmlFor={styles.remember}>Remember me</label>
						</div>
						<Link to=''>Forgot Password</Link>
          </div>

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