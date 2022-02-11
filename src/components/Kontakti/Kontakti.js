import React, { useState, useEffect } from 'react';
import HelperFuntion from '../../helper/HelperFunction';
import { theme } from '../../assets/svgs';
import { LoaderCustom } from '../LoaderCustom';

const Kontakti = () => {
    const [pretragaLegende, setPretragaLegende] = useState('')
    const [data, setData] = useState([])
    const { GetAllFirmeIKontakte } = HelperFuntion()
    useEffect(() => {
        const Funkcija = async () => setData(await GetAllFirmeIKontakte())
        Funkcija()
    }, []);
    //&&legend[0].broj.includes(pretragaLegende)
    const FilterFirme = data.filter(legend => {
        return legend[0].naziv.toLowerCase().includes(pretragaLegende.toLowerCase())
    })
    if(!data.length)
    return <LoaderCustom/>

    return <table>
        <thead>
            <tr><th></th><th><input type="text" value={pretragaLegende} onChange={(e) => setPretragaLegende(e.target.value)} placeholder='pretraga' /></th></tr>
            {/* <tr>
            <th>No</th>
            <th>Firma</th>
            <th>Mail</th>
            <th>Kontakt osoba</th>
            <th>Kontakt osoba</th>
            </tr> */}
        </thead>
        <tbody>
            {FilterFirme.map((m, index) => (
                <RowNiz key={index} rowNiz={m} index={index} setData={setData} />
            ))}
        </tbody>
    </table>
}

const RowNiz = ({ rowNiz, index, setData }) => {
    const { UpdateMailFirme, GetAllFirmeIKontakte,InsertKontakti } = HelperFuntion()
    const [osenci, setOsenci] = useState(false)
    const [mailEdit, setMailEdit] = useState(false)
    const [newMail, setNewMail] = useState(rowNiz[0].mail)
    const [insertOn,setInsertOn]=useState(false)
    const [newKontakt,setNewKontakt]=useState({osoba:'',broj:''})
    const MailUpdate = async () => {
        UpdateMailFirme(rowNiz[0].id, newMail, rowNiz[0].naziv)
        setData(await GetAllFirmeIKontakte())
        setMailEdit(prev => prev = !prev)
    }
    const InsertKontaktiIUpdate=async()=>{
       await InsertKontakti(rowNiz[0].id,newKontakt.osoba,newKontakt.broj)
       setData(await GetAllFirmeIKontakte())
       setInsertOn(prev => prev = !prev)
    }

    return <tr style={osenci ? { background: 'lightGray' } : index % 2 ? { background: '#ffb310' } : null}>
        <td onClick={() => setOsenci(prev => prev = !prev)} style={{ minWidth: '5rem', textAlign: 'center' }}>{index + 1}</td>
        <td style={{ minWidth: '37rem' }}>{rowNiz[0].naziv}</td>
        <td style={{ minWidth: '25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>{!mailEdit ? (<h1>{rowNiz[0].mail}</h1>) : (<input onChange={(e) => setNewMail(e.target.value)} type='text' value={newMail} />)}{newMail !== rowNiz[0].mail ? (<h1 onClick={MailUpdate}>{theme.saveSvg}</h1>) : (<h1 onClick={() => setMailEdit(prev => prev = !prev)}>{theme.editSvg}</h1>)}</td>
        {rowNiz.map((n, index2) => (
            <Row key={index2} niz={n} setData={setData} />
        ))}
        {insertOn?(<td style={{display:'flex', alignItems:'center',justifyContent:'space-evenly'}}>
        <input placeholder='nova osoba' value={newKontakt.osoba} onChange={(e)=>setNewKontakt({...newKontakt,osoba:e.target.value})} type="text" />
        <input placeholder='broj telefona' value={newKontakt.broj} onChange={(e)=>setNewKontakt({...newKontakt,broj:e.target.value})} type="text" />
        <h1 onClick={InsertKontaktiIUpdate} style={{marginLeft:'5px'}}>{theme.saveSvg}</h1>
        </td>):null}
        <td style={{background:'#ffcc5c',border:'none'}}><h1 onClick={()=>setInsertOn(prev=>prev=!prev)} style={!insertOn?{color:'green',width:'2rem',background:'lightGreen', borderRadius:'10rem',textAlign:'center'}:{color:'white',width:'2rem',background:'red', borderRadius:'10rem',textAlign:'center'}}>{!insertOn?'+':'-'}</h1></td>
    </tr>
}
const Row = ({ niz,setData }) => {
    const {UpdateKontaktIBroj,GetAllFirmeIKontakte,BrisanjeKontakta}=HelperFuntion()
    const [editOn, setEditOn] = useState(false)
    const [editKontakt, setEditKontakt] = useState({ osoba: niz.osoba, broj: niz.broj })
    const UpdateKontakt=async()=>{
        await UpdateKontaktIBroj(niz.idKontakta, editKontakt.osoba, editKontakt.broj)
        setData(await GetAllFirmeIKontakte())
        setEditOn(prev=>prev=!prev)
    }
    const DeleteKontakt=async()=>{
        await BrisanjeKontakta(niz.idKontakta, editKontakt.osoba)
        setData(await GetAllFirmeIKontakte())
    }
    return <td>{niz.broj && !editOn ? (
        <h1 style={{ whiteSpace: 'nowrap',width:'30rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{niz.osoba}</span>
            <span style={{ float: 'right' }}>
            <span>{niz.broj}</span>
                <span onClick={() => setEditOn(prev => prev = !prev)} style={{ marginRight: '5px', marginLeft: '20px' }}>{theme.editSvg}</span>
                <span onClick={DeleteKontakt}>{theme.deleteSvg}</span></span></h1>) : (
        editOn ? <h1 style={{whiteSpace:'nowrap',display:'flex',alignItems:'center',width:'30rem', justifyContent:'space-between'}}>
            <input style={{width:'10rem'}} onChange={(e)=>setEditKontakt({...editKontakt,osoba:e.target.value})} value={editKontakt.osoba} type="text" />
            <input style={{width:'10rem'}} onChange={(e)=>setEditKontakt({...editKontakt,broj:e.target.value})} value={editKontakt.broj} type="text" />
            <span style={{ float: 'right' }}>
            {niz.osoba===editKontakt.osoba&&niz.broj===editKontakt.broj?(<span onClick={() => setEditOn(prev => prev = !prev)} style={{ marginRight: '5px', marginLeft: '20px' }}>{theme.editSvg}</span>):(<span onClick={UpdateKontakt} style={{ marginRight: '5px', marginLeft: '20px' }}>{theme.saveSvg}</span>)}
            <span>{theme.deleteSvg}</span>
            </span>
        </h1> : null)}</td>
}
export default Kontakti