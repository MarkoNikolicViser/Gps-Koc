import React, { useState, useEffect } from 'react'
import { ChartStatistikaBar } from './ChartStatistikaBar'
import { ChartStatistikaPie } from './ChartStatistikaPie'
import HelperFuntion from '../../helper/HelperFunction'


export const Statistika = () => {

    const { VratiSveUsere } = HelperFuntion()
    const [opcija, setOpcija] = useState(1)
    const [users, setUsers] = useState([])
    const [user, setUser] = useState('')
    const date = new Date()
    const DodajNuluJEdnocifrenomMesecu = () => {
        if (date.getMonth() <= 9)
            return '-0'
        else {
            return '-'
        }
    }
    const [datum, setDatum] = useState({
        dan:date.getFullYear() + DodajNuluJEdnocifrenomMesecu() + (parseInt(date.getMonth()) + 1) + '-' + date.getDate(),
        mesec:date.getFullYear() + DodajNuluJEdnocifrenomMesecu() + (parseInt(date.getMonth()) + 1)
    })
    useEffect(() => {
        const Funkcija = async () => setUsers(await VratiSveUsere())
        Funkcija()
    }, [])

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{display:'flex'}}>
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
            {opcija!=4?<input value={datum.dan} onChange={e => setDatum({...datum,dan:e.target.value})} type="date" />:<input value={datum.mesec} onChange={e => setDatum({...datum,mesec:e.target.value})} type="month" />}
            <ChartStatistikaBar user={user} opcija={opcija} datum={datum} />
        </div>
    )
}