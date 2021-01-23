import React, { useState } from 'react'
import '../styles/LoginPage.css'
import { FaWhatsapp } from "react-icons/fa";
import { Link, useHistory } from 'react-router-dom'
import api from '../services/api.js'
import { login } from '../services/api.js'

export default function SignInPage() {
    const [ password, setPassword ] = useState('')
    const [ email, setEmail ] = useState('') 
    const [ warning, setWarning ] = useState('') 

    const history = useHistory()

    async function SignIn(event){
        event.preventDefault()

        email.trim()

        await api.post('/authenticate', { "email" : email, "password" : password }).then((response) => {

            login(response.data.token)

            return history.push('/')
        }).catch(res => {
            return setWarning('Email ou senha inválidos!')
        })
    }
    return(
        <div className='login-page'>
            <div className='login-form'>

            <div className='title'>
            <span>Entrar</span>
            </div>
                
                <form onSubmit={SignIn}>
                    <span>Email:</span>
                    <div className='form-input'>
                        <input type='email' placeholder='Digite seu Email...' onChange={(event) => { setEmail(event.target.value); console.log(email)}}/>
                    </div>

                    <span>Senha:</span>
                    <div className='form-input'>
                        <input type='password' placeholder='Digite sua Senha...' onChange={(event) => { setPassword(event.target.value); console.log(password)}}/>
                    </div>

                    <div className='remember-and-forgotPassword'>
                        <div>
                            <input type='checkbox' id='remember'/>
                            <label htmlFor='remember'>Lembrar-se</label>
                        </div>
                        <Link to=''>Esqueci minha senha</Link>
                    </div>

                    <span className='warning'>{warning}</span>

                    {password && email !== '' ? (
                        <button type='submit' className='button'>
                            <FaWhatsapp size={35} fill='#fff'/>
                            Entrar
                        </button>
                    ) : (
                        <div type='submit' className='button disable'>
                            <FaWhatsapp size={35} fill='#fff'/>
                            Entrar
                        </div>
                    )} 
                </form> 
                <div className='SignIn'>
                    <Link to='/SignUp'>Não tem uma conta? Clique aqui!</Link>  
                </div>  
            </div>
        </div>
    )
}