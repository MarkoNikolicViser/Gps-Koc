import React, { useState, useRef, useEffect, useContext } from "react";
import './Login.css'
import { TContext } from '../context';

const Login = () => {

    const PassRef = useRef(null)

    const { loginToken, korisnik } = useContext(TContext)
    const [loginTokenValue, setLoginTokenValue] = loginToken
    const [korisnikValue, setKorisnikValue] = korisnik
    const [mail, setMail] = useState('')
    const [pass, setPass] = useState('')
    const [passOn, setPassOn] = useState(false)
    const [loginPoruka, setLoginPoruka]=useState('')

    const PosaljiUpit = async (e) => {
        e.preventDefault()
        const parametri = { mail: mail, pass: pass };
        const data = await (await fetch('https://mvps.almaks.rs:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parametri)
        })).json();
        if (data.length !== undefined) {
            let ime = data[0].mail.replace('@almaks.rs', '')
            ime = ime.replace('.', ' ')
            setKorisnikValue(prev => prev = {Id:data[0].Id ,ime: ime, pravo: data[0].pravo })
            setLoginTokenValue(true)
        }
        else{
            setLoginPoruka(prev=>prev=data.message)
        }
    }

    useEffect(() => {
        if (passOn)
            PassRef.current.type = 'text'
        else {
            PassRef.current.type = 'password'
        }
    }, [passOn])


    return (
        <div style={{ height: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="login-wrap">
                <div className="login-html">
                    <input id="tab-1" type="radio" name="tab" className="sign-in" defaultChecked /><label htmlFor="tab-1" className="tab">Prijavi se</label>
                    <input id="tab-2" type="radio" name="tab" className="sign-up" /><label htmlFor="tab-2" className="tab"></label>
                    <div className="login-form">
                        <div className="sign-in-htm">
                        <form onSubmit={PosaljiUpit}>
                            <div className="group">
                                <label htmlFor="user" className="label">Mail</label>
                                <input id="user" onChange={(e) => setMail(prev => prev = e.target.value)} type="text" className="input" />
                            </div>
                            <div className="group">
                                <label htmlFor="pass" className="label">Lozinka</label>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                    <input id="pass" ref={PassRef} onChange={(e) => setPass(prev => prev = e.target.value)} type="text" className="input" data-type="password" />
                                    {!passOn ? (<svg onClick={() => { setPassOn(prev => prev = !prev) }} style={{ fill: 'white' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M12.015 7c4.751 0 8.063 3.012 9.504 4.636-1.401 1.837-4.713 5.364-9.504 5.364-4.42 0-7.93-3.536-9.478-5.407 1.493-1.647 4.817-4.593 9.478-4.593zm0-2c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 3c-2.209 0-4 1.792-4 4 0 2.209 1.791 4 4 4s4-1.791 4-4c0-2.208-1.791-4-4-4z" /></svg>) : (<svg style={{ fill: 'red' }} onClick={() => { setPassOn(prev => prev = !prev) }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M19.604 2.562l-3.346 3.137c-1.27-.428-2.686-.699-4.243-.699-7.569 0-12.015 6.551-12.015 6.551s1.928 2.951 5.146 5.138l-2.911 2.909 1.414 1.414 17.37-17.035-1.415-1.415zm-6.016 5.779c-3.288-1.453-6.681 1.908-5.265 5.206l-1.726 1.707c-1.814-1.16-3.225-2.65-4.06-3.66 1.493-1.648 4.817-4.594 9.478-4.594.927 0 1.796.119 2.61.315l-1.037 1.026zm-2.883 7.431l5.09-4.993c1.017 3.111-2.003 6.067-5.09 4.993zm13.295-4.221s-4.252 7.449-11.985 7.449c-1.379 0-2.662-.291-3.851-.737l1.614-1.583c.715.193 1.458.32 2.237.32 4.791 0 8.104-3.527 9.504-5.364-.729-.822-1.956-1.99-3.587-2.952l1.489-1.46c2.982 1.9 4.579 4.327 4.579 4.327z" /></svg>)}
                                </div>
                            </div>
                            <div className="group">
                                {loginPoruka}
                                <input type="submit" className="button" value="Uloguj se" />
                            </div>
                            </form>
                            <div className="hr"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login;