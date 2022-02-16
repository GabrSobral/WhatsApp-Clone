import React, { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'

import { SignInput } from '../../components/SignInput';
import { SignButton } from '../../components/SignButton';

import { useAuth } from '../../contexts/AuthContext';
import styles from '../SignIn/styles.module.scss'

export function SignUp() {
  const [ name, setName ] = useState('')
  const [ phoneNumber, setPhoneNumber ] = useState('') 
  const [ warning, setWarning ] = useState('') 
  const [ isLoading, setIsLoading ] = useState(false) 

  const { signInOrSignUp } = useAuth()
  // const history = useHistory()

  async function signUp(event: FormEvent){
    event.preventDefault()

    setIsLoading(true);
    name.trim();
    phoneNumber.trim();

    try {
      await signInOrSignUp(name, phoneNumber)
      setIsLoading(false)
      // history.push('/')
    } catch(error: any) {
      console.log(error)
      setWarning(error.response.data.error)
      setIsLoading(false)
    }
  }

  return(
    <div className={styles.login_page}>
      <div className={styles.login_form}>
        <span className={styles.title}>Sign Up</span>
        
        <form onSubmit={signUp}> 
          <SignInput
            data={name}
            setData={(value: string) => setName(value)}
            type="text"
            title="Name:"
          />

          <SignInput
            data={phoneNumber}
            setData={(value: string) => setPhoneNumber(value)}
            type="number"
            title="Phone number:"
          />

          <span className={styles.message}>{warning}</span>

          <SignButton
            isFilled={!!(name && phoneNumber)}
            isLoading={isLoading}
            title="Sign up"
            disabled={!(name && phoneNumber)}
          />
        </form> 

        <div className={styles.sign}>
          <Link to='/SignIn'>Already have a account? Click here!</Link>
        </div>
      </div>
    </div>
  )
}