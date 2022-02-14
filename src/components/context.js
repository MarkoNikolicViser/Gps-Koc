import React, {createContext, useState} from 'react'

export const TContext=createContext();



export const TProvider=(props)=>{
    const url='https://mvps.almaks.rs:3001/'
    //const url='http://localhost:3001/'

    const[komentari,setKomentari]=useState([{
        id:"",
        tiket:"",
        komentar:"",
        boja:"#ff4646",
        korisnik:""
    }]);
    const[voziloInfo,setVoziloInfo]=useState({
        x:20.6011428833,
        y:44.6703948975,
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
            voziloInfo:[voziloInfo,setVoziloInfo]
         }}>
            {props.children}
        </TContext.Provider>
    )
}