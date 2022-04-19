import React, { useState, useEffect } from 'react'
import { ChartStatistikaBar } from './ChartStatistikaBar'
import HelperFuntion from '../../helper/HelperFunction'


export const Statistika = () => {

    const { VratiSveUsere, DodajNuluJEdnocifrenomBroju } = HelperFuntion()
    const [opcija, setOpcija] = useState(1)
    const [users, setUsers] = useState([])
    const [user, setUser] = useState('')
    const date = new Date()
    const [datum, setDatum] = useState({
        dan: date.getFullYear() + '-' + DodajNuluJEdnocifrenomBroju(parseInt(date.getMonth()) + 1) + '-' + DodajNuluJEdnocifrenomBroju(date.getDate()),
        mesec: date.getFullYear() + '-' + DodajNuluJEdnocifrenomBroju(parseInt(date.getMonth()) + 1)
    })
    useEffect(() => {
        let cleanUp=true
        const Funkcija = async () => setUsers(await VratiSveUsere())
        if(cleanUp)
        Funkcija()
        return ()=>{cleanUp=false;setUsers([])}
    }, [])

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ display: 'flex' }}>
                <select onChange={e => setUser(e.target.value)} defaultValue='default'>
                    <option value='default'>Odaberi korisnika</option>
                    {users.map((m, index) => (
                        <option key={index} value={m.Id}>{m.mail}</option>
                    ))}
                </select>
                <select onChange={e => setOpcija(e.target.value)} value={opcija}>
                    <option value="1">Dnevni</option>
                    <option value="2">Sedmični</option>
                    <option value="3">Mesečni</option>
                    <option value="4">Godišnji</option>
                </select>
            </div>
            {opcija != 4 ? <input value={datum.dan} onChange={e => setDatum({ ...datum, dan: e.target.value })} type="date" /> : <input value={datum.mesec} onChange={e => setDatum({ ...datum, mesec: e.target.value })} type="month" />}
            <ChartStatistikaBar user={user} opcija={opcija} datum={datum} />
        </div>
    )
}