import { FormEvent, useState } from 'react';
import Loading from 'react-loading';
import { useNavigate } from 'react-router-dom';
import { ConfirmButton } from '../../components/ConfirmButton';

import { SignInput } from '../../components/SignInput/index';
import { useAuth } from '../../contexts/AuthContext';

import styles from './styles.module.scss';

export const Authenticate = () => {
  const [ phoneNumber, setPhoneNumber ] = useState('');
  const [ name, setName ] = useState('');
  const [ warning, setWarning ] = useState('');
	const [ isLoading, setIsLoading ] = useState(false);

	const { signUp } = useAuth();
  const navigate = useNavigate();

  async function handleAuth(event: FormEvent){
		event.preventDefault();
		phoneNumber.trim();
		name.trim();

		setIsLoading(true);

		try {
			await signUp(phoneNumber, name)
			navigate("/")
		} catch(error: any) {
			setWarning(String(error));
		}
		setIsLoading(false);
  };

  return(
    <div className={styles.login_page}>
			<div className={styles.login_form}>
				<span className={styles.title}>Sign Up</span>
          
        <form onSubmit={handleAuth}>
					<SignInput
						data={name} type="text" title="Name:"
						setData={(value: string) => setName(value)}
					/>
					<SignInput
						data={phoneNumber} type="number" title="Phone Number:"
						setData={(value: string) => setPhoneNumber(value)}
					/>

          { warning && <span className={styles.message}>{warning}</span> }
					
					<ConfirmButton type='submit' text='Sign Up' isLoading={isLoading}/>
        </form>
      </div>
    </div>
  )
}