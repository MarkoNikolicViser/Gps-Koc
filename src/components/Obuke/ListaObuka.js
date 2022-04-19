import React, { useEffect, useState } from 'react';
import HelperFuntion from '../../helper/HelperFunction';
import { LoaderCustom } from '../LoaderCustom'
import { theme } from '../../assets/svgs';

export const ListaObuka = () => {
    const { GetAllFirmeIKontakte } = HelperFuntion()
    const [obuke, setObuke] = useState([])
    const [pretraga, setPretraga] = useState('')
    useEffect(() => {
        let cleanUp=true
        const Funkcija = async () => {
            const data = await GetAllFirmeIKontakte()
            data.sort((a, b) => {
                return a[0].odrzana - b[0].odrzana;
            });
            setObuke(data)
        }
        if(cleanUp)
        Funkcija()
        return ()=>{cleanUp=false;setObuke([])}
    }, [])
    const FilterFirme = obuke.filter(legend => {
        return legend[0].naziv.toLowerCase().includes(pretraga.toLowerCase())
    })
    if (!obuke.length)
        return <LoaderCustom />
    return <table style={{ whiteSpace: 'nowrap' }}>
        <thead>
            <tr>
                <th>Korisnik</th>
                <th>Broj telefona</th>
                <th>Datum otvaranja naloga</th>
                <th>Zakazana obuka</th>
                <th>Održana</th>
                <th>Obuku održao</th>
                <th colSpan='2'>Edit</th>
            </tr>
            <tr style={{ textAlign: 'center' }}>
                <td style={{ border: 'none' }}><input placeholder='Pretraga' value={pretraga} onChange={(e) => setPretraga(e.target.value)} type="text" /></td>
            </tr>
        </thead>
        <tbody>
            {FilterFirme.map((m, index) => (
                <Row key={index} row={m} setObuke={setObuke} />
            ))}
        </tbody>
    </table>
}

const Row = ({ row, setObuke }) => {
    const { KonverterVremenaIzBaze, UpdateObukeDatumIPredavac, GetAllFirmeIKontakte, KonverzijaVremenaStatistika, KonverzijaVremenaObuka } = HelperFuntion()
    const niz = row[0]
    const [edit, setEdit] = useState(false)
    const [editValue, setEditValue] = useState({ zakazana: KonverzijaVremenaObuka(niz.zakazana), predavac: niz.predavac })


    const OsveziState = async () => {
        const data = await GetAllFirmeIKontakte()
        data.sort((a, b) => {
            return a[0].odrzana - b[0].odrzana;
        });
        setObuke(data)
    }

    const Cancel = () => {
        setEditValue({ zakazana: KonverzijaVremenaObuka(niz.zakazana), predavac: niz.predavac })
        setEdit(false)
    }
    const Update = async () => {
        await UpdateObukeDatumIPredavac(niz.id, editValue.zakazana, editValue.predavac, niz.odrzana, niz.naziv)
        await OsveziState()
        setEdit(false)
        setEditValue({ zakazana: KonverzijaVremenaObuka(niz.zakazana), predavac: niz.predavac })
    }
    const UpdateSelect = async (e) => {
        let zakazana=niz.zakazana.replace('.000Z','')
        await UpdateObukeDatumIPredavac(niz.id,zakazana, niz.predavac, e.target.value, niz.naziv)
        //setEditValue({zakazana:niz.zakazana,predavac:niz.predavac})
        await OsveziState()
        //setEdit(false)
    }
    const DeleteDate = async () => {
        await UpdateObukeDatumIPredavac(niz.id, '0000-00-00 00:00:00', niz.predavac, niz.odrzana, niz.naziv)
        await OsveziState()
    }

    return <tr style={!niz.odrzana ? { background: '#FF7F7F' } : null}>
        <td>{niz.naziv}</td>
        <td><h1 style={{ width: '150px', textAlign: 'center' }}>{niz.broj}</h1></td>
        <td>{KonverterVremenaIzBaze(niz.vreme)}</td>
        {!edit ? <>{niz.zakazana != '0000-00-00 00:00:00' ? <td style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '25px' }}><h1 style={{ width: '200px', textAlign: 'center' }}>{KonverterVremenaIzBaze(niz.zakazana)}</h1>
            <button onClick={DeleteDate}>X</button></td> :
            <td style={{ minWidth: '220px' }}></td>}</> :
            <td><input value={editValue.zakazana} style={{ width: '200px' }} onChange={(e) => setEditValue({ ...editValue, zakazana: e.target.value })} type="datetime-local" /></td>}
        <td>
            <select value={niz.odrzana} onChange={UpdateSelect}>
                <option value="1">Održana</option>
                <option value="0">Nije Održana</option>
            </select>
        </td>
        {!edit ? <td><h1 style={{ width: '150px', textAlign: 'center' }}>{niz.predavac}</h1></td> : <td><input onChange={(e) => setEditValue({ ...editValue, predavac: e.target.value })} value={editValue.predavac} style={{ width: '150px' }} type="text" /></td>}
        {(editValue.zakazana !== KonverzijaVremenaObuka(niz.zakazana) || editValue.predavac !== niz.predavac) && edit == true ? <><td onClick={Update}>{theme.saveSvg}</td><td onClick={Cancel}>{theme.cancleSvg}</td></> : <td colSpan='2' onClick={() => setEdit(prev => prev = !prev)}><h1 style={{ textAlign: 'center', width: '65px' }}>{theme.editSvg}</h1></td>}
        {/* {edit?<><td onClick={Update}>{theme.saveSvg}</td><td onClick={Cancel}>{theme.cancleSvg}</td></>:<td colSpan='2' onClick={()=>setEdit(prev=>prev=!prev)}><h1 style={{textAlign:'center', width:'65px'}}>{theme.editSvg}</h1></td>} */}
    </tr>
}