import React, { useState,useContext } from "react";
import ListaVozila from "./components/Vozila/ListaVozila";
import './App.css'
import Mapa from "./components/MapaLegenda/Mapa";
import {TContext} from './components/context';
import Login from './components/Login/Login'
import Profile from "./components/Profile/Profile";
import Legenda from "./components/MapaLegenda/Legenda";
import Kontakti from "./components/Kontakti/Kontakti";
import {ListaObuka} from "./components/Obuke/ListaObuka";
import { ListaNaloga } from "./components/Nalozi/ListaNaloga";

const App = () => {

  const [izbor, setIzbor] = useState({ m: true, k: false, o: false, n: false, l: false })

  const{loginToken,korisnik}=useContext(TContext)
  const[loginTokenValue,setLoginTokenValue]=loginToken
  const[korisnikValue,setKorisnikValue]=korisnik
  if(!loginTokenValue){
    return <Login/>
  }


  return (
    <div className='app'>
      <ListaVozila />
      <div className='main'>
        <nav style={{ width: '100%', height: '3%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <ul style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'space-evenly' }}>
            <li style={{ background: '#588c7e' }} onClick={() => setIzbor(prev => prev = { m: true, k: false, o: false, n: false, l: false })}>Monitoring</li>
            <li style={{ background: '#ffcc5c' }} onClick={() => setIzbor(prev => prev = { m: false, k: true, o: false, n: false, l: false })}>Kontakti</li>
            <li style={{ background: '#f2ae72' }} onClick={() => setIzbor(prev => prev = { m: false, k: false, o: true, n: false, l: false })}>Obuke</li>
            <li style={{ background: '#5dc8ef' }} onClick={() => setIzbor(prev => prev = { m: false, k: false, o: false, n: true, l: false })}>Nalozi</li>
            {korisnikValue.pravo?(<li style={{ background: '#96ceb4' }} onClick={() => setIzbor(prev => prev = { m: false, k: false, o: false, n: false, l: true })}>Korisnik</li>):(null)}
          </ul>
          <div style={{display:'flex', justifyContent:'space-evenly',alignItems:'center',width:'30%'}}>
          <h1 style={{textTransform:'capitalize', whiteSpace:'nowrap',textAlign:'center'}}>{korisnikValue.ime}</h1>
          <svg onClick={()=>setLoginTokenValue(prev=>!prev)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 9v-4l8 7-8 7v-4h-8v-6h8zm-16-7v20h14v-2h-12v-16h12v-2h-14z"/></svg>
          </div>
        </nav>
        {izbor.m ? (<div style={{ background: '#588c7e', height: '97%', borderRadius: '0 3rem 0 0' }}>
          <div style={{ display: 'flex',alignItems:'center',justifyContent:'center',flexDirection: 'column', height: '100%', width: 'inherit' }}>
            <div style={{width:'95%',height:'100%', paddingTop:'1%'}}>
              <Mapa />
              <Legenda/>
            </div>
          </div>
        </div>) : null}
        {izbor.k ? (<div style={{ background: '#ffcc5c', height: '97%', borderRadius: '0 3rem 0 0',maxWidth:'auto', overflow:'scroll' }}><Kontakti/></div>) : null}
        {izbor.o ? (<div style={{ background: '#f2ae72', height: '97%', borderRadius: '0 3rem 0 0',maxWidth:'auto', overflow:'scroll' }}><ListaObuka/></div>) : null}
        {izbor.n ? (<div style={{ background: '#5dc8ef', height: '97%', borderRadius: '0 3rem 0 0',maxWidth:'auto', overflow:'scroll' }}><ListaNaloga/></div>) : null}
        {izbor.l ? (<div style={{ background: '#96ceb4', height: '97%', borderRadius: '0 3rem 0 0' }} className='nalozi'><Profile/></div>) : null}
      </div>
    </div>
  )
}
export default App;