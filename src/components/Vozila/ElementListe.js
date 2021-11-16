import React, { useEffect, useState,useContext } from "react";
import MoreInfo from "./MoreInfo";
import HelperFuntion from "../../helper/HelperFunction";
import {TContext} from '../context';

/* global wialon */

// utills function
function msg(msg) {
    console.log(msg);
}
const ElementListe = ({ vozila,setVozila,vozilo, bazaInfo }) => {
    //////////////////////////////////////////////
    const{lokacija,ikonica}=useContext(TContext)
    const [lokacijaValue,setLokacijaValue]=lokacija
    const [ikonicaValue, setIkonicaValue]=ikonica
    ///////////////////////////////////////////////
    const [moreInfo, setMoreInfo] = useState(false)
    const { IspisiRazlikuNejavljanja, GetInfoVozilo,Boje } = HelperFuntion()
    const [lokacija2, setLokacija2] = useState('')
    const [nazivUredjaja,setNazivUredjaja]=useState('')
    const [granica,setGranica]=useState(false)
    const [senzori,setSenzori]=useState([])
    const [bazaInfoNew, setBazaInfoNew]=useState([])//osvezen info iz baze


    const Lokacija = (x, y) => {
        wialon.util.Gis.getLocations([{ lon: x, lat: y }], function (code, address) {
            if (code) { msg(wialon.core.Errors.getErrorText(code)); return; }
            setLokacija2(prev => prev = address[0]);
            if(!address[0].includes('Serbia')&&vozilo.raw.$$user_phoneNumber.includes('+381'))
            setGranica(prev=>prev=true)
        });
    }
    const ObojRed=()=>{
        if(bazaInfo.length<=0&&bazaInfoNew.length<=0)
        return {background:'#FAF9F6'}
        let id
        if(bazaInfoNew.length>0)
        id=bazaInfoNew[bazaInfoNew.length-1].boja
        else{
        id=bazaInfo[bazaInfo.length-1].boja}
        return Boje(id)
    }

    const MoreInfoFunkcija =async () => {
        Lokacija(vozilo.raw.getPosition().x,vozilo.raw.getPosition().y)
        setMoreInfo(prev => prev = !prev)
        Senzori()
       setBazaInfoNew(await GetInfoVozilo(vozilo))
        VratiNazivUredjaja(vozilo.raw.$$user_deviceTypeId)
    }
    const VratiNazivUredjaja=(idHardvera)=>{
        wialon.core.Session.getInstance().getHwTypes(
            [{filterType:"",
              filterValue:[""],
              includeType:"",
              ignoreRename:""}], 
      function (code, col){
          if (code != 0){ 
              msg(wialon.core.Errors.getErrorText(code)); 
              return ; 
          }
          col.map(m=>{
              if(m.id===idHardvera)
              setNazivUredjaja(prev=>prev=m.name)
          })
          });
    }
    const Senzor = (nazivSenzora) => {
        let unit = vozilo.raw
        let napon = 0;
        let sens = vozilo.raw.$$user_sensors
        for (var i in sens) {
            if (sens[i].n.includes(nazivSenzora))
                napon = sens[i].id
        }
        let senzor = unit.getSensor(napon)
        var result = unit.calculateSensorValue(senzor, unit.getLastMessage());
        if(result == -348201.3876) result = "N/A"
        else{
            result=result.toFixed(1)
        }
        return result
    }
    const Senzori = () => {
        let unit = vozilo.raw
        let sens = vozilo.raw.$$user_sensors
        let senzori=[]
        for (var i in sens) {
                let senzor = unit.getSensor(sens[i].id)
                var result = unit.calculateSensorValue(senzor, unit.getLastMessage());
                if(result == -348201.3876) result = "N/A"
                senzori.push({senzor:sens[i].n,vrednost:result})
        }
        setSenzori(senzori)
    }
    return <>
        {vozilo && <div>
            <div style={ObojRed()} className='row'>
                <img onClick={MoreInfoFunkcija} src={vozilo.raw.getIconUrl()} alt="" />
                <div style={{ whiteSpace: 'noWrap', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'left', justifyContent: 'center', width: '70%' }}>
                    <div>
                       <b className='ime' onClick={()=>{setLokacijaValue(prev=>prev={x:vozilo.raw.getPosition().x, y:vozilo.raw.getPosition().y});setIkonicaValue(prev=>prev=vozilo.raw.getIconUrl())}}>{vozilo.name}</b>
                       {/* <b className='hover-ime'>{vozilo.name}</b> */}
                    </div>
                    <div>
                        {IspisiRazlikuNejavljanja(vozilo.raw.$$user_lastMessage.t).vreme}
                    </div>
                    <div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width:'170px',marginLeft:'3px' }}>
                    {vozilo.raw.$$user_position.sc !== 255 && vozilo.raw.$$user_position.sc ? <svg style={{ fill: 'green',width:'17px' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.213 16.984c.97-1.028 2.308-1.664 3.787-1.664s2.817.636 3.787 1.664l-3.787 4.016-3.787-4.016zm-1.747-1.854c1.417-1.502 3.373-2.431 5.534-2.431s4.118.929 5.534 2.431l2.33-2.472c-2.012-2.134-4.793-3.454-7.864-3.454s-5.852 1.32-7.864 3.455l2.33 2.471zm-4.078-4.325c2.46-2.609 5.859-4.222 9.612-4.222s7.152 1.613 9.612 4.222l2.388-2.533c-3.071-3.257-7.313-5.272-12-5.272s-8.929 2.015-12 5.272l2.388 2.533z" /></svg> : (<svg style={{ fill: 'red',width:'17px' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.213 16.984c.97-1.028 2.308-1.664 3.787-1.664s2.817.636 3.787 1.664l-3.787 4.016-3.787-4.016zm-1.747-1.854c1.417-1.502 3.373-2.431 5.534-2.431s4.118.929 5.534 2.431l2.33-2.472c-2.012-2.134-4.793-3.454-7.864-3.454s-5.852 1.32-7.864 3.455l2.33 2.471zm-4.078-4.325c2.46-2.609 5.859-4.222 9.612-4.222s7.152 1.613 9.612 4.222l2.388-2.533c-3.071-3.257-7.313-5.272-12-5.272s-8.929 2.015-12 5.272l2.388 2.533z" /></svg>)}
                    {Senzor('Kontakt')>0?(<svg style={{ width:'17px' ,fill:'green' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12.451 17.337l-2.451 2.663h-2v2h-2v2h-6v-5l6.865-6.949c1.08 2.424 3.095 4.336 5.586 5.286zm11.549-9.337c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-3-3c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2z" /></svg>):(<svg style={{ width:'17px', fill:'red' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12.451 17.337l-2.451 2.663h-2v2h-2v2h-6v-5l6.865-6.949c1.08 2.424 3.095 4.336 5.586 5.286zm11.549-9.337c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-3-3c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2z" /></svg>)}
                   <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',color:'gray'}}>
                   <svg style={{fill:'gray',width:'17px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 8v8h-17v-8h17zm2-2h-21v12h21v-12zm1 9h.75c.69 0 1.25-.56 1.25-1.25v-3.5c0-.69-.56-1.25-1.25-1.25h-.75v6zm-16-6h-3v6h3v-6zm4 0h-3v6h3v-6zm4 0h-3v6h3v-6z"/></svg>
                     <h5>{Senzor('Napon')}V</h5>
                   </div>
                   <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',color:'gray'}}>
                   <svg style={{fill:'gray', width:'17px'}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c-6.627 0-12 5.373-12 12 0 2.583.816 5.042 2.205 7h19.59c1.389-1.958 2.205-4.417 2.205-7 0-6.627-5.373-12-12-12zm-.758 2.14c.256-.02.51-.029.758-.029s.502.01.758.029v3.115c-.252-.027-.506-.042-.758-.042s-.506.014-.758.042v-3.115zm-5.763 7.978l-2.88-1.193c.157-.479.351-.948.581-1.399l2.879 1.192c-.247.444-.441.913-.58 1.4zm1.216-2.351l-2.203-2.203c.329-.383.688-.743 1.071-1.071l2.203 2.203c-.395.316-.754.675-1.071 1.071zm.793-4.569c.449-.231.919-.428 1.396-.586l1.205 2.875c-.485.141-.953.338-1.396.585l-1.205-2.874zm1.408 13.802c.019-1.151.658-2.15 1.603-2.672l1.501-7.041 1.502 7.041c.943.522 1.584 1.521 1.603 2.672h-6.209zm4.988-11.521l1.193-2.879c.479.156.948.352 1.399.581l-1.193 2.878c-.443-.246-.913-.44-1.399-.58zm2.349 1.217l2.203-2.203c.383.329.742.688 1.071 1.071l-2.203 2.203c-.316-.396-.675-.755-1.071-1.071zm2.259 3.32c-.147-.483-.35-.95-.603-1.39l2.86-1.238c.235.445.438.912.602 1.39l-2.859 1.238z"/></svg>
                   {Senzor('Brzina')!="N/A"?(<h5>{(Senzor('Brzina')*10)/10} km/h</h5>):(<h5>{(vozilo.raw.$$user_position.s.toFixed(0))} km/h</h5>)}
                </div>
                </div>

                <div style={{ width: '3%', height: '100%', background: IspisiRazlikuNejavljanja(vozilo.raw.$$user_lastMessage.t).boja }}>
                </div>
            </div>
            {moreInfo ? (<MoreInfo
                lokacija={lokacija2}
                razlika={IspisiRazlikuNejavljanja(vozilo.raw.$$user_lastMessage.t).vreme}
                vreme={wialon.util.DateTime.formatTime(vozilo.raw.$$user_lastMessage.t, 0)}
                x={vozilo.raw.getPosition().x}
                y={vozilo.raw.getPosition().y}
                sateliti={vozilo.raw.$$user_position.sc}
                unit={vozilo.raw}
                brzinaCan={Senzor('Brzina')}
                brzina={vozilo.raw.$$user_position.s}
                kilometrazaCan={Senzor('Kilometraža')}
                kilometraza={vozilo.raw.$$user_mileageCounter}
                senzori={senzori}
                ObojRed={ObojRed()}
                bazaInfo={bazaInfo}
                bazaInfoNew={bazaInfoNew}
                setBazaInfoNew={setBazaInfoNew}
                broj={vozilo.raw.$$user_phoneNumber}
                granica={granica}
                nazivUredjaja={nazivUredjaja}
                idUredjaja={vozilo.raw.$$user_uniqueId}
                idVozilo={vozilo.raw.getId()}
                vozilo={vozilo}
                vozila={vozila}
                setVozila={setVozila}
            />) : (null)}
        </div>}
    </>
}
export default ElementListe