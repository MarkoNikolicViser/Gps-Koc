import React, { useState, useRef, useEffect } from "react";
import '../Login/Login.css'

const Register = () => {

    const PassRef = useRef(null)
    
    const [nalozi,setNalozi]=useState([])
    const [naloziLozinke,setNaloziLozinke]=useState(false)
    const [mail, setMail] = useState('')
    const [pass, setPass] = useState('')
    const [pravo, setPravo] = useState('DEFAULT')
    const [passOn, setPassOn] = useState(false)
    const [loginPoruka, setLoginPoruka] = useState('')

const ProveraMaila=async()=>{
    const parametri = { mail: mail};
    const data = await (await fetch('https://mvps.almaks.rs:3001/mail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(parametri)
    })).json();
    return data;
}
const BrisanjeNaloga=async(Id,mail)=>{
    let result = window.confirm(`Da li želite da obrišete nalog ${mail}?`);
    if(!result)
    return null
    const data = await (await fetch(`https://mvps.almaks.rs:3001/nalozi/delete/${Id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }})).json();
    FetchNaloge()
}


    const FetchNaloge=async()=>{
        const data=await(await fetch('https://mvps.almaks.rs:3001/nalozi')).json()
        setNalozi(data)
    }
useEffect(() => {
    FetchNaloge()
}, [])
    const PosaljiUpit = async (e) => {
        e.preventDefault()
        const validanMail=mail.length>15&&mail.endsWith('@almaks.rs')?true:false
        const validanPass=pass.length>3?true:false
        if(!validanMail){
            setLoginPoruka('uneti validan mail koji se zavrsava sa @almaks.rs')
        return null}
        else if(!validanPass){
            setLoginPoruka('duzina lozinke mora biti 4 karaktera ili vise')
        return null}
        else if(pravo==='DEFAULT'){
            setLoginPoruka('neophodno je zadati pravo korisniku')
        return null}
        const proveraMaila=await ProveraMaila()
        if(proveraMaila.message){
            setLoginPoruka(proveraMaila.message)
            return null
        }

        const parametri = { mail: mail, pass: pass, pravo: pravo };
        const data = await (await fetch('https://mvps.almaks.rs:3001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parametri)
        })).json();
        setLoginPoruka(data.message)
        setMail('')
        setPass('')
        setPravo('DEFAULT')
        FetchNaloge()
     }

    useEffect(() => {
        if (passOn)
            PassRef.current.type = 'text'
        else {
            PassRef.current.type = 'password'
        }
    }, [passOn])


    return (
        <div style={{display:'flex', alignItems:'center',justifyContent:'space-evenly'}}>
            <div style={{ height: '95vh', width: '33.3%', display: 'flex', alignItems: 'center', justifyContent: 'center',textAlign:'center' }}>
                <table style={{background:'#FAF9F6'}}>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Mail</th>
                            <th>Lozinka </th>
                            <th>
                            {naloziLozinke ? (<svg onClick={() => { setNaloziLozinke(prev => prev = !prev) }} style={{ fill: 'gray' }} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M12.015 7c4.751 0 8.063 3.012 9.504 4.636-1.401 1.837-4.713 5.364-9.504 5.364-4.42 0-7.93-3.536-9.478-5.407 1.493-1.647 4.817-4.593 9.478-4.593zm0-2c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 3c-2.209 0-4 1.792-4 4 0 2.209 1.791 4 4 4s4-1.791 4-4c0-2.208-1.791-4-4-4z" /></svg>) : (<svg style={{ fill: 'red' }} onClick={() => { setNaloziLozinke(prev => prev = !prev) }} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M19.604 2.562l-3.346 3.137c-1.27-.428-2.686-.699-4.243-.699-7.569 0-12.015 6.551-12.015 6.551s1.928 2.951 5.146 5.138l-2.911 2.909 1.414 1.414 17.37-17.035-1.415-1.415zm-6.016 5.779c-3.288-1.453-6.681 1.908-5.265 5.206l-1.726 1.707c-1.814-1.16-3.225-2.65-4.06-3.66 1.493-1.648 4.817-4.594 9.478-4.594.927 0 1.796.119 2.61.315l-1.037 1.026zm-2.883 7.431l5.09-4.993c1.017 3.111-2.003 6.067-5.09 4.993zm13.295-4.221s-4.252 7.449-11.985 7.449c-1.379 0-2.662-.291-3.851-.737l1.614-1.583c.715.193 1.458.32 2.237.32 4.791 0 8.104-3.527 9.504-5.364-.729-.822-1.956-1.99-3.587-2.952l1.489-1.46c2.982 1.9 4.579 4.327 4.579 4.327z" /></svg>)}
                            </th>
                            <th>Pravo</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nalozi.map((m,index)=>(
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{m.mail}</td>
                                {naloziLozinke?(<td colSpan='2'>{m.pass}</td>):(<td colSpan='2'>###</td>)}
                                {m.pravo?(<td>Admin</td>):(<td>User</td>)}
                                <td>
                                <svg onClick={()=>alert('Ova opcija biće dodata u sledećem ažuriranju')} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z" /></svg>
                                </td>
                                <td>
                                <svg className='kanta' onClick={()=>BrisanjeNaloga(m.Id,m.mail)} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z" /></svg>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        <div style={{ height: '95vh', width: '33.3%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="login-wrap">
                <div className="login-html">
                    <input id="tab-1" type="radio" name="tab" className="sign-in" /><label htmlFor="tab-1" className="tab"></label>
                    <input id="tab-2" type="radio" name="tab" className="sign-up" defaultChecked /><label htmlFor="tab-2" className="tab">Registruj novog korisnika</label>
                    <div className="login-form">
                        <form onSubmit={PosaljiUpit}>
                        <div className="sign-up-htm">
                            <div className="group">
                                <label htmlFor="user" className="label">Mail Adresa</label>
                                <input id="user" onChange={(e)=>setMail(e.target.value)} value={mail} type="text" className="input" />
                            </div>
                            <div className="group">
                                <label htmlFor="pass" className="label">Lozinka</label>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                    <input id="pass" onChange={(e) => setPass(e.target.value)} value={pass} ref={PassRef} type="text" className="input" data-type="password" />
                                    {!passOn ? (<svg onClick={() => { setPassOn(prev => prev = !prev) }} style={{ fill: 'white' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M12.015 7c4.751 0 8.063 3.012 9.504 4.636-1.401 1.837-4.713 5.364-9.504 5.364-4.42 0-7.93-3.536-9.478-5.407 1.493-1.647 4.817-4.593 9.478-4.593zm0-2c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 3c-2.209 0-4 1.792-4 4 0 2.209 1.791 4 4 4s4-1.791 4-4c0-2.208-1.791-4-4-4z" /></svg>) : (<svg style={{ fill: 'red' }} onClick={() => { setPassOn(prev => prev = !prev) }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M19.604 2.562l-3.346 3.137c-1.27-.428-2.686-.699-4.243-.699-7.569 0-12.015 6.551-12.015 6.551s1.928 2.951 5.146 5.138l-2.911 2.909 1.414 1.414 17.37-17.035-1.415-1.415zm-6.016 5.779c-3.288-1.453-6.681 1.908-5.265 5.206l-1.726 1.707c-1.814-1.16-3.225-2.65-4.06-3.66 1.493-1.648 4.817-4.594 9.478-4.594.927 0 1.796.119 2.61.315l-1.037 1.026zm-2.883 7.431l5.09-4.993c1.017 3.111-2.003 6.067-5.09 4.993zm13.295-4.221s-4.252 7.449-11.985 7.449c-1.379 0-2.662-.291-3.851-.737l1.614-1.583c.715.193 1.458.32 2.237.32 4.791 0 8.104-3.527 9.504-5.364-.729-.822-1.956-1.99-3.587-2.952l1.489-1.46c2.982 1.9 4.579 4.327 4.579 4.327z" /></svg>)}
                                </div>
                            </div>

                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <select className='odabirPravo' onChange={(e) => setPravo(e.target.value)} value={pravo}>
                                    <option value='DEFAULT' disabled>Pravo</option>
                                    <option value='1'>Admin</option>
                                    <option value='0'>User</option>
                                </select>
                            </div>
                            <div className="group">
                                <input type="submit" className="button" value="Potvrdi" />
                            </div>
                            <h3 style={{textAlign:'center',color:'#FAF9F6'}}>{loginPoruka}</h3>
                            <div className="hr"></div>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}
export default Register;