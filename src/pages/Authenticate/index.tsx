import { FormEvent, useState } from 'react'
import Loading from 'react-loading';
import { useNavigate } from 'react-router-dom'
import { ISignInputProps, SignInput } from '../../components/SignInput/index';
import { useAuth } from '../../contexts/AuthContext'

import styles from './styles.module.scss'

export const Authenticate = () => {
  const [ phoneNumber, setPhoneNumber ] = useState('');
  const [ name, setName ] = useState('');
	const [ page, setPage ] = useState("Sign In");
  const [ warning, setWarning ] = useState('');
	const [ isLoading, setIsLoading ] = useState(false);

	const { signInOrSignUp } = useAuth();
  const navigate = useNavigate()

	const signInInputs: ISignInputProps[] = [
		{
			data: phoneNumber,
			setData: (value: string) => setPhoneNumber(value),
			type:"number",
			title:"Phone number:",
		}
	]
	const signUpInputs: ISignInputProps[] = [
		{
			data: name,
			setData: (value: string) => setName(value),
			type:"text",
			title:"Name:",
		},
		{
			data: phoneNumber,
			setData: (value: string) => setPhoneNumber(value),
			type:"number",
			title:"Phone number:",
		}
	]

  async function handleAuth(event: FormEvent){
		event.preventDefault();
		phoneNumber.trim();
		name.trim();

		setIsLoading(true);
		
		if(page === "Sign In")
			signInOrSignUp(phoneNumber)
				.then(() => navigate("/"))
				.catch((message) => setWarning(message));
		else
			signInOrSignUp(phoneNumber, name)
				.then(() => navigate("/"))
				.catch((message) => setWarning(message));

		setIsLoading(false);
  }

	const changePage = () => setPage(prev => prev === "Sign In" ? "Sign Up":"Sign In");
	
  return(
    <div className={styles.login_page}>
			<div className={styles.login_form}>
				<span className={styles.title}>{page}</span>
          
        <form onSubmit={handleAuth}>
					{ page === "Sign In" ? 
						signInInputs.map(item => <SignInput {...item} key={item.title}/> ) :
						signUpInputs.map(item => <SignInput {...item} key={item.title}/> )
					}

          {warning && <span className={styles.message}>{warning}</span>}
					
					<button type='submit' className={styles.button} disabled={false}>
						{!isLoading ? page : 
							<Loading type="spin" width={24} height={24} color="#ffffff"/>
						}
					</button>
        </form> 

				<button type="button" className={styles.sign} onClick={changePage}>
					{ page === "Sign In" ? 
						"Do not have an account yet? Click here!" : 
						"Already have a account? Click here!"
					}
				</button>
      </div>
    </div>
  )
}