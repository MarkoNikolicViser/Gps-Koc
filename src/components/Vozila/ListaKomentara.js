import React, { useState, useEffect, useContext } from 'react'
import HelperFuntion from '../../helper/HelperFunction'
import { TContext } from '../context'

const ListaKomentara = ({ vozila, setVozila, info, setBazaInfoNew, bazaInfo, vozilo }) => {
    ///////////////////////////////
    const { korisnik,url } = useContext(TContext)
    const [korisnikValue, setKorisnikValue] = korisnik
    //////////////////////////////

    const { Boje, GetInfoVozilo,OsveziElementBaze,KonverterVremenaIzBaze } = HelperFuntion()

    const [vlasnikKomentara, setVlasnikKomentara] = useState('')

    const VratiVlasnikaKomentara = async () => {
        const parametri = { Id: info.korisnik };
        const data = await (await fetch(`${url}user/id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parametri)
        })).json();
        let ime = data[0].mail.replace('@almaks.rs', '')
        ime = ime.replace('.', ' ')
        setVlasnikKomentara(ime)
    }
    const BrisanjeKomentara = async () => {
        let result = window.confirm(`Da li želite da obrišete komentar '${info.komentar}'`);
        if (!result)
            return null
        const data = await (await fetch(`${url}komentar/delete/${info.Id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })).json();
        const proveraBazaInfoNew = await GetInfoVozilo(vozilo)
        setBazaInfoNew(proveraBazaInfoNew)
        if (!proveraBazaInfoNew.length && bazaInfo.length) {
            await OsveziElementBaze(vozilo, vozila)
            setVozila([...vozila])
        }

    }
    useEffect(() => {
        VratiVlasnikaKomentara()
    }, [])
    return (
        <tr style={Boje(info.boja)}>
            <td style={{ width: '50%' }}>{info.komentar}</td>
            <td style={{ textTransform: 'capitalize' }}>{vlasnikKomentara}</td>
            <td>{KonverterVremenaIzBaze(info.datum)}</td>
            {korisnikValue.pravo || info.korisnik === korisnikValue.Id ? <>
                {/* <td>
                    <svg style={{ display: 'flex', alignItems: 'center' }} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z" /></svg>
                </td> */}
                <td>
                    <svg onClick={BrisanjeKomentara} style={{ display: 'flex', alignItems: 'center' }} className='kanta' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z" /></svg>
                </td>
            </> : (<><td></td></>)}
        </tr>
    )
}
export default ListaKomentara