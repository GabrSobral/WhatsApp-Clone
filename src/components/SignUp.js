import React, { useState } from 'react'
import '../styles/LoginPage.css'
import { FaWhatsapp } from "react-icons/fa";
import { Link, useHistory } from 'react-router-dom'
import api from '../services/api.js'
import { login } from '../services/api.js'

export default function SignUpPage() {
    const [ name, setName ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ email, setEmail ] = useState('') 
    const [ confirmacao, setConfirmacao ] = useState('')   
    const [ warning, setWarning ] = useState('') 

    const history = useHistory()

    async function SignUp(event){
        event.preventDefault()

        name.trim()
        email.trim()

        if(password !== confirmacao) return setWarning('As senhas NÃO estão iguais.')

        try {
            await api.post('/register', { "name" : name, "email" : email, "password" : password }).then((response) => {
                login(response.data.token)
    
                return history.push('/')
            }).catch(err => {
                return setWarning("Email já cadastrado, tente outro!")
            })
        } catch(err) {
            return console.log()
        }
      
    }

    return(
        <div className='login-page'>
            <div className='login-form'>

                <div className='title'>
                <span >Cadastrar-se</span>
                </div>
                
                <form onSubmit={SignUp}> 
                    
                    <span>Nome:</span>
                    <div className='form-input'>
                        <input type='text' placeholder='Digite seu Nome...' onChange={(event)=> { setName(event.target.value)}} />
                    </div>

                    <span>Email:</span>
                    <div className='form-input'>
                        <input type='email' placeholder='Digite seu Email...' onChange={(event)=> { setEmail(event.target.value)}}/>
                    </div>

                    <span>Senha:</span>
                    <div className='form-input'>
                        <input type='password' placeholder='Digite sua Senha...' onChange={(event)=> { setPassword(event.target.value)}}/>
                    </div>

                    <span>Confirmação de senha:</span>
                    <div className='form-input'>
                        <input type='password' placeholder='Confirme sua Senha...' onChange={(event)=> { setConfirmacao(event.target.value)}}/>
                    </div>

                    <span className='warning'>{warning}</span>

                    {name && password && email && confirmacao !== '' ? (
                        <button type='submit' className='button'>
                            <FaWhatsapp size={35} fill='#fff'/>
                            Cadastrar
                        </button>
                    ) : (
                        <div type='submit' className='button disable'>
                            <FaWhatsapp size={35} fill='#fff'/>
                            Cadastrar
                        </div>
                    )} 
                    
                </form> 

                <div className='SignIn'>
                    <Link to='/SignIn'>Já tem uma conta? Clique aqui!</Link>  
                </div>
                
            </div>
        </div>
    )
}