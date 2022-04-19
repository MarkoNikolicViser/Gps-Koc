import React, { useState, useEffect } from 'react'
import HelperFuntion from '../../helper/HelperFunction';
import { theme } from '../../assets/svgs';
import { LoaderCustom } from '../LoaderCustom';

export const ListaNaloga = () => {
    const [data, setData] = useState([])
    const [pretraga, setPretraga] = useState('')
    const { GetAllFirmeINaloge } = HelperFuntion()
    useEffect(() => {
        let cleanUp=true
        const Funkcija = async () => setData(await GetAllFirmeINaloge())
        if(cleanUp)
        Funkcija()
        return ()=>{cleanUp=false;setData([])}
    }, []);

    const FilterFirme = data.filter(legend => {
        return legend[0].naziv.toLowerCase().includes(pretraga.toLowerCase())
    })
    if (!data.length)
        return <LoaderCustom />

    return <table style={{ color: '#696969' }}>
        <thead>
            <tr><th></th><th><input type="text" value={pretraga} onChange={(e) => setPretraga(e.target.value)} placeholder='pretraga' /></th></tr>
        </thead>
        <tbody>
            {FilterFirme.map((m, index) => (
                <RowNiz key={index} rowNiz={m} index={index} setData={setData} />
            ))}
        </tbody>
    </table>
}

const RowNiz = ({ rowNiz, index, setData }) => {
    const [osenci, setOsenci] = useState(false)
    const [insertOn, setInsertOn] = useState(false)
    const [newData,setNewData]=useState({ platforma: '', korisnickoIme: '', lozinka: '' })
    const {InsertNalozi,GetAllFirmeINaloge}=HelperFuntion()
    
    const Insert=async()=>{
        console.log(rowNiz[0].id,newData.platforma,newData.korisnickoIme,newData.lozinka)
        await InsertNalozi(rowNiz[0].id,newData.platforma,newData.korisnickoIme,newData.lozinka)
        setData(await GetAllFirmeINaloge())
        setInsertOn(false)
    }

    return <tr style={osenci ? { background: 'lightGray', height: '70px' } : index % 2 ? { background: '#2fb8ea', height: '70px' } : { height: '70px' }}>
        <td onClick={() => setOsenci(prev => prev = !prev)} style={{ minWidth: '5rem', textAlign: 'center' }}>{index + 1}</td>
        <td style={{ minWidth: '37rem' }}>{rowNiz[0].naziv}</td>
        {rowNiz.map((n, index2) => (
            <Row key={index2} niz={n} setData={setData} />
        ))}
        {insertOn ? (<td style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
            <div style={{display:'flex',flexDirection:'column'}}>
                <input onChange={(e)=>setNewData({...newData, platforma:e.target.value})} value={newData.platforma} placeholder='platforma' type="text" />
                <input onChange={(e)=>setNewData({...newData, korisnickoIme:e.target.value})} value={newData.korisnickoIme} placeholder='korisničko ime' type="text" />
                <input onChange={(e)=>setNewData({...newData, lozinka:e.target.value})} value={newData.lozinka} placeholder='lozinka' type="text" />
            </div>
            <h1 onClick={Insert} style={{ marginLeft: '5px' }}>{theme.saveSvg}</h1>
        </td>) : null}
        <td style={{ background: '#5dc8ef', border: 'none' }}><h1 onClick={() => setInsertOn(prev => prev = !prev)} style={!insertOn ? { color: 'green', width: '2rem', background: 'lightGreen', borderRadius: '10rem', textAlign: 'center' } : { color: 'white', width: '2rem', background: 'red', borderRadius: '10rem', textAlign: 'center' }}>{!insertOn ? '+' : '-'}</h1></td>
    </tr>
}

const Row = ({ niz, setData }) => {
    const [edit, setEdit] = useState(false)
    const [editData, setEditData] = useState({ platforma: niz.platforma, korisnickoIme: niz.korisnickoIme, lozinka: niz.lozinka })
    const {UpdateNalozi,GetAllFirmeINaloge}=HelperFuntion()



    const Update=async()=>{
        await UpdateNalozi(niz.idNalozi,editData.platforma,editData.korisnickoIme,editData.lozinka,niz.naziv)
        setData(await GetAllFirmeINaloge())
        setEdit(false)
    }

    const flexRow = { display: 'flex', justifyContent: 'space-between', alingItems: 'center', minWidth: '300px' }
    return <td style={{ minWidth: '420px' }}>
        {niz.korisnickoIme ? <div style={{ display: 'flex', justifyContent: 'space-between', alingItems: 'center' }}>
            <div>
                <h1 style={flexRow}>
                    <span>Platforma: </span><span>{edit ? <input style={{ height: '1.7rem' }} onChange={(e) => setEditData({ ...editData, platforma: e.target.value })} value={editData.platforma} type='text' /> : niz.platforma}</span>
                </h1>
                <h1 style={flexRow}>
                    <span>Korisničko ime: </span><span>{edit ? <input required style={{ height: '1.7rem' }} onChange={(e) => setEditData({ ...editData, korisnickoIme: e.target.value })} value={editData.korisnickoIme} type='text' /> : niz.korisnickoIme}</span>
                </h1>
                <h1 style={flexRow}>
                    <span>Lozinka: </span><span>{edit ? <input required style={{ height: '1.7rem' }} onChange={(e) => setEditData({ ...editData, lozinka: e.target.value })} value={editData.lozinka} type='text' /> : niz.lozinka}</span>
                </h1>
            </div>
            <div style={{ textAlign: 'center', paddingTop: '17.5px', paddingLeft: '10px' }}>
                {(editData.platforma !== niz.platforma || editData.korisnickoIme !== niz.korisnickoIme || editData.lozinka !== niz.lozinka) && edit == true ?
                    <div style={{display:'flex',width:'5rem',justifyContent:'space-between'}}><h1 onClick={Update}>{theme.saveSvg}</h1>
                        <h1 onClick={() => setEdit(prev => prev = !prev)}>{theme.cancleSvg}</h1></div>
                    : <div colSpan='2' onClick={() => setEdit(prev => prev = !prev)}><h1 style={{ textAlign: 'center', width: '25px' }}>{theme.editSvg}</h1></div>}
            </div>
        </div> : null}
    </td>
}