import React, { useState, useEffect } from 'react'
import HelperFuntion from '../../helper/HelperFunction'

const Legenda = () => {
    const { GetAllFirmeILokacije,InsertFirmaILokacija } = HelperFuntion()
    const [on, setOn] = useState(false)
    const [sveFirme, setSveFirme] = useState([])
    const [pretragaLegende,setPretragaLegende]=useState('')
    const [novaInfo,setNovaInfo]=useState({naziv:'',lokacija:''})

    useEffect(() => {
        const Funkcija = async () => {
            setSveFirme(await GetAllFirmeILokacije())
        }
        Funkcija()
    }, [])
    const InsertFirma=async(e)=>{
        e.preventDefault()
        await InsertFirmaILokacija(novaInfo.naziv,novaInfo.lokacija)
        setSveFirme(await GetAllFirmeILokacije())
        setNovaInfo({naziv:'',lokacija:''})
    }
    const FilterFirme=sveFirme.filter(legend=>{
        return legend.naziv.toLowerCase().includes(pretragaLegende.toLowerCase())
      })
    return (
        <div style={{ width: '100%', height: '50%', background: 'lightGray', marginTop: '1%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity:'0.9' }}>
            <table style={{ width: '90%',height:'90%'}}>
                <thead>
                    <tr  style={{ display:'flex', alignItems:'center', justifyContent:'space-evenly',width:'100%'}}>
                        {!on ? (<th><input value={pretragaLegende} onChange={(e)=>setPretragaLegende(e.target.value)} placeholder='pretraga firmi' type="text" /></th>)
                            : (<th>
                                <form onSubmit={InsertFirma} style={{ display: 'flex', flexDirection: 'column', alignItems:'center' }}>
                                    <input value={novaInfo.naziv} onChange={(e)=>setNovaInfo({...novaInfo,naziv:e.target.value})} placeholder='Unesi naziv firme' type="text" />
                                    <input value={novaInfo.lokacija} onChange={(e)=>setNovaInfo({...novaInfo,lokacija:e.target.value})} placeholder='Unesi lokaciju firme' type="text" />
                                    <button disabled={!novaInfo.naziv||!novaInfo.lokacija} type='submit' style={{padding:'2.5px 5px 2.5px 5px'}}>Sačuvaj novu firmu</button>
                                </form>
                            </th>)}
                        <th style={{background:'gray',width:'5rem'}} onClick={() => setOn(prev => prev = !prev)}><h1 style={on ? { transform: 'rotate(45deg)', color: 'red',fontSize:'2rem' } : { color: 'green',fontSize:'2rem' }}>+</h1></th>
                    </tr>
                </thead>
                <tbody style={{display:'block',overflowY:'scroll',height:'90%',width:'100%'}}>
                    {FilterFirme.map((m,index) => (
                        <Element key={m.Id} index={index+1} props={m} setSveFirme={setSveFirme}/>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
const Element = ({props,index,setSveFirme}) => {
const [edit,setEdit]=useState(false)
const [editInfo,setEditInfo]=useState({naziv:props.naziv, lokacija:props.lokacija})
const { GetAllFirmeILokacije,BrisanjeFirmeILokacije,UpdateFirmeILokacije } = HelperFuntion()
const editSvg=<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M18.363 8.464l1.433 1.431-12.67 12.669-7.125 1.436 1.439-7.127 12.665-12.668 1.431 1.431-12.255 12.224-.726 3.584 3.584-.723 12.224-12.257zm-.056-8.464l-2.815 2.817 5.691 5.692 2.817-2.821-5.693-5.688zm-12.318 18.718l11.313-11.316-.705-.707-11.313 11.314.705.709z" /></svg>
const deleteSvg=<svg className='kanta' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z" /></svg>
const saveSvg=<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M21.856 10.303c.086.554.144 1.118.144 1.697 0 6.075-4.925 11-11 11s-11-4.925-11-11 4.925-11 11-11c2.347 0 4.518.741 6.304 1.993l-1.422 1.457c-1.408-.913-3.082-1.45-4.882-1.45-4.962 0-9 4.038-9 9s4.038 9 9 9c4.894 0 8.879-3.928 8.99-8.795l1.866-1.902zm-.952-8.136l-9.404 9.639-3.843-3.614-3.095 3.098 6.938 6.71 12.5-12.737-3.096-3.096z" /></svg>
const cancleSvg=<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 16.538l-4.592-4.548 4.546-4.587-1.416-1.403-4.545 4.589-4.588-4.543-1.405 1.405 4.593 4.552-4.547 4.592 1.405 1.405 4.555-4.596 4.591 4.55 1.403-1.416z"/></svg>

const BrisiFirmu=async(Id,firma)=>{
    await BrisanjeFirmeILokacije(Id,firma)
    setSveFirme(await GetAllFirmeILokacije())
}
const UpdateFirme=async(Id, firma, lokacija)=>{
    await UpdateFirmeILokacije(Id, firma, lokacija)
    setSveFirme(await GetAllFirmeILokacije())
    setEdit(prev=>prev=!prev)
}


    return (
        <tr style={index%2?{width:'100%',background:'darkGray'}:{width:'100%'}}>
            <td>{index}</td>
            {!edit?(<td style={{width:'20%'}}>{props.naziv}</td>):(<td style={{width:'20%'}}><input onChange={(e)=>setEditInfo({...editInfo,naziv:e.target.value})} value={editInfo.naziv} style={{width:'100%'}} type="text" /></td>)}
            {!edit?(<td style={{width:'100%'}}>{props.lokacija}</td>):(<td style={{width:'100%'}}><input onChange={(e)=>setEditInfo({...editInfo,lokacija:e.target.value})} value={editInfo.lokacija} style={{width:'100%'}} type="text" /></td>)}
            {!edit?(<td onClick={()=>setEdit(prev=>prev=!prev)} style={{textAlign:'center'}}>{editSvg}</td>):(props.naziv!==editInfo.naziv||props.lokacija!==editInfo.lokacija?<td onClick={()=>UpdateFirme(props.Id,editInfo.naziv,editInfo.lokacija)}>{saveSvg}</td>:<td onClick={()=>setEdit(prev=>prev=!prev)}>{cancleSvg}</td>)}
            <td onClick={()=>BrisiFirmu(props.Id,props.naziv)} style={{textAlign:'center'}}>{deleteSvg}</td>
        </tr>
    )
}
export default Legenda;