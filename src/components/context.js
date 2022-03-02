import React, {createContext, useState} from 'react'

export const TContext=createContext();



export const TProvider=(props)=>{
    //const url='https://mvps.almaks.rs:3001/'
    const url='http://localhost:3004/'

    const [svaVozilaC,setSvaVozilaC]=useState([])
    const[komentari,setKomentari]=useState([{
        id:"",
        tiket:"",
        komentar:"",
        boja:"#ff4646",
        korisnik:""
    }]);
    const[voziloInfo,setVoziloInfo]=useState({
        x:20.48622948478398,
        y:44.79223535978762,
        tablice:'',
        ikonica:''
    })
    const[loginToken,setLoginToken]=useState(false)
    const[korisnik,setKorisnik]=useState({Id:'', ime:'',pravo:''})
    
    return(                                                  
        <TContext.Provider value={{komentari:[komentari,setKomentari],
            loginToken:[loginToken,setLoginToken],
            korisnik:[korisnik,setKorisnik],
            url:url,
            voziloInfo:[voziloInfo,setVoziloInfo],
            svaVozilaC:[svaVozilaC,setSvaVozilaC]
         }}>
            {props.children}
        </TContext.Provider>
    )
}