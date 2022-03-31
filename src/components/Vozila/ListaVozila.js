import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import ElementListe from "./ElementListe";
import HelperFuntion from "../../helper/HelperFunction";
import { LoaderCustom } from "../LoaderCustom";
import { TContext } from "../context";

/* global wialon */

// utills function
function msg(msg) {
    console.log(msg);
}

// Main app class
const ListaVozila = () => {
    const{svaVozilaC}=useContext(TContext)
    const [svaVozilaCValue,setSvaVozilaCValue]=svaVozilaC
    const { GetInfoVozilo,ProveraObuke, KonverterVremenaIzBaze } = HelperFuntion()

    const [svaVozila, setSvaVozila] = useState([])
    const [vozila24, setVozila24] = useState([])
    const [filtriranaVozila,setFiltriranaVozila]=useState([])
    const [pretraga, setPretraga] = useState('')
    const [duzeOd24, setDuzeOd24] = useState({ svi: true, duze: false })
    const [hasMore, setHesMore] = useState(true)
    const [prikaz, setPrikaz] = useState(200)
    const [prikaz24, setPrikaz24] = useState(150)
    const [loading, setLoading] = useState(true)
    const [moreInfo, setMoreInfo] = useState(false)
    const observer = useRef()
    const lastElement = useCallback(node => {
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPrikaz(prev => prev = prev + 100)
            }
        })
        if (node) observer.current.observe(node)
    }, [])
    const lastElement24 = useCallback(node => {
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPrikaz24(prev => prev = prev + 100)
            }
        })
        if (node) observer.current.observe(node)
    }, [])

    useEffect(()=>{
        const intervalId = setInterval(async() => {
            const data=await ProveraObuke()
            if(!data.length)
            return
        let result = window.confirm(`Potsetnik za obuku\n
        ${data.map(m=>'firma '+m.naziv+' u '+KonverterVremenaIzBaze(m.zakazana))}
        `);
        if (!result)
            return null
    },[900000])
    return () => {
        clearInterval(intervalId); //This is important
    }
    },[])

    const [vozila, setVozila] = useState([])
    const token = `${process.env.REACT_APP_TOKEN_ANALIZE}`

    useEffect(() => {
        componentDidMount()
    }, [])
    useEffect(() => {
        init()
    }, [prikaz])
    useEffect(() => {
        ucitajJos24()
    }, [prikaz24])
    const [okiniFilter,setOkiniFilter]=useState(false)
    useEffect(() => {
        FiltriranaVozila()
    }, [okiniFilter])
    useEffect(() => {
        if(pretraga.length>=3)
        setOkiniFilter(prev=>prev=!prev)
    }, [pretraga])
    const componentDidMount = () => {
        // initialize Wialon session
        wialon.core.Session.getInstance().initSession("https://hst-api.wialon.com");
        // Try to login when component mount
        wialon.core.Session.getInstance().loginToken(
            token,
            "", // try to login
            code => {
                // login callback
                // if error code - print error message
                if (code) {
                    msg(wialon.core.Errors.getErrorText(code));
                    return;
                }
                init();
            }
        );
    }
    const init = async () => {
        const sess = wialon.core.Session.getInstance(); // get instance of current Session
        // flags to specify what kind of data should be returned
        const flags = wialon.item.Item.dataFlag.base |
            wialon.item.Unit.dataFlag.sensors |
            wialon.item.Unit.dataFlag.lastMessage|
            wialon.item.Unit.dataFlag.counters|
            wialon.item.Unit.dataFlag.restricted|
            wialon.item.Unit.dataFlag.other;
        sess.loadLibrary("unitSensors"); // load Sensor Library

        sess.loadLibrary("itemIcon"); // load Icon Library
        sess.updateDataFlags(
            // load items to current session
            [{ type: "type", data: "avl_unit", flags: flags, mode: 0 }], // Items specification
           async code => {
                // updateDataFlags callback
                if (code) {
                    msg(wialon.core.Errors.getErrorText(code));
                    return;
                } // exit if error code

                // get loaded 'avl_unit's items
                const units = sess.getItems("avl_unit");
                if (!units || !units.length) {
                    msg("Units not found");
                    return;
                } // check if units found
                let unitsStateSvi = [];
                for (let i = 0; i < units.length; i++) {
                    setLoading(true)
                    let unit = units[i];
                    if (unit.getLastMessage())
                        unitsStateSvi.push({
                            id: unit.getId(),
                            name: unit.getName(),
                            raw: unit
                        });
                }
                const res = unitsStateSvi.sort(function (a, b) {
                    return a.raw.$$user_lastMessage.t - b.raw.$$user_lastMessage.t;
                });
                let unitsState = [];
                for (let i = 0; i < prikaz; i++) {
                    let unit = res[i];
                    let bazaInfo=await GetInfoVozilo(unit)
                    unitsState.push(
                        {unit:unit,
                        bazaInfo:bazaInfo 
                        }
                    );
                }
                setVozila(prev => prev = unitsState)
                setSvaVozila(prev => prev = res)
                setSvaVozilaCValue(prev => prev = res)
                setLoading(false)
            }
        );
        ucitajJos24()
    }

    const FiltriranaVozila=async()=>{
        let filtriranaVozilaT = svaVozila.filter(vozilo => {
            return vozilo.name.toLowerCase().includes(pretraga.toLowerCase())
        })
        let niz=[]
        for(let i=0;i<filtriranaVozilaT.length;i++){
            let unit = filtriranaVozilaT[i];
                    let bazaInfo=await GetInfoVozilo(unit)
                    niz.push({
                        unit:unit,
                        bazaInfo:bazaInfo
                    })
        }
        setFiltriranaVozila(prev=>prev=niz)
    }
 

    const ucitajJos24 = async() => {
        let niz = [];
        const vremeSad = new Date().getTime()
        if (svaVozila.length > 0) {
            for (let i = 0; i < svaVozila.length; i++) {
                const zadnjeJavljanje = new Date(svaVozila[i].raw.$$user_lastMessage.t * 1000)
                let razlika = vremeSad - zadnjeJavljanje;
                razlika = razlika / 1000;
                var seconds = Math.floor(razlika % 60);
                razlika = razlika / 60;
                var minutes = Math.floor(razlika % 60);
                razlika = razlika / 60;
                var hours = Math.floor(razlika % 24);
                var days = Math.floor(razlika / 24);
                if (days)
                    niz.push(svaVozila[i])
            }
            const res = niz.sort(function (a, b) {
                return b.raw.$$user_lastMessage.t - a.raw.$$user_lastMessage.t;
            });
            let niz2 = []
            for (let i = 0; i < prikaz24; i++) {
                let unit = res[i];
                let bazaInfo=await GetInfoVozilo(unit)
                niz2.push({unit:unit,bazaInfo:bazaInfo})
            }
            setVozila24(prev => prev = niz2)
        }
    }

    return (
        <div className="lista">
            {loading && <div style={{ width: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <LoaderCustom />
            </div>}
            {!loading && <div style={{ width: '400px' }}>
                <input value={pretraga} type="text" onChange={(e) => setPretraga(prev => prev = e.target.value)} name="" id="" />
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                    <div>
                        <input checked={duzeOd24.svi} onChange={() => {setDuzeOd24(prev => prev = { svi: true, duze: false });setPretraga(prev=>prev='')}} type="radio" name="Svi" id="" />
                        <label htmlFor="svi">Svi</label>
                    </div>
                    <div>
                        <input checked={duzeOd24.duze} type="radio" onChange={() => {setDuzeOd24(prev => prev = { svi: false, duze: true });setPretraga(prev=>prev='')}} name="duze" id="" />
                        <label htmlFor="duze">Duže od 24h</label>
                    </div>
                    <svg style={{border:'1px solid grey',margin:'1px',background:'lightGray',borderRadius:'2px'}} onClick={init} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M9 12l-4.463 4.969-4.537-4.969h3c0-4.97 4.03-9 9-9 2.395 0 4.565.942 6.179 2.468l-2.004 2.231c-1.081-1.05-2.553-1.699-4.175-1.699-3.309 0-6 2.691-6 6h3zm10.463-4.969l-4.463 4.969h3c0 3.309-2.691 6-6 6-1.623 0-3.094-.65-4.175-1.699l-2.004 2.231c1.613 1.526 3.784 2.468 6.179 2.468 4.97 0 9-4.03 9-9h3l-4.537-4.969z"/></svg>
                </div>
                <div className='skrol'>
                    {pretraga.length < 3 && duzeOd24.svi && vozila.map((u, index) => {
                        if (vozila.length === index + 1) {
                            return <div ref={lastElement} key={u.unit.id}>
                                <ElementListe vozila={vozila} setVozila={setVozila} vozilo={u.unit} bazaInfo={u.bazaInfo}/>
                            </div>
                        } else {
                            return <div key={u.unit.id}>
                                <ElementListe vozila={vozila} setVozila={setVozila} vozilo={u.unit} bazaInfo={u.bazaInfo}/>
                            </div>
                        }
                    })}
                    {pretraga.length >= 3 && filtriranaVozila.map((u, index) => {
                        return <div key={u.unit.id}>
                            <ElementListe vozila={filtriranaVozila} setVozila={setFiltriranaVozila} vozilo={u.unit} bazaInfo={u.bazaInfo}/>
                        </div>
                    })}
                    {duzeOd24.duze && vozila24.map((u, index) => {
                        if (vozila24.length === index + 1) {
                            return <div ref={lastElement24} key={u.unit.id}>
                                <ElementListe vozila={vozila24} setVozila={setVozila24} vozilo={u.unit} bazaInfo={u.bazaInfo}/>
                            </div>
                        } else {
                            return <div key={u.unit.id}>
                                <ElementListe vozila={vozila24} setVozila={setVozila24} vozilo={u.unit} bazaInfo={u.bazaInfo}/>
                            </div>
                        }
                    })}
                </div>
            </div>}     
              </div>
    );
}

export default React.memo(ListaVozila)