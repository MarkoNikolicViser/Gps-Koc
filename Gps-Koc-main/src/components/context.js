import React, {createContext, useState} from 'react'

export const TContext=createContext();



export const TProvider=(props)=>{
    const[komentari,setKomentari]=useState([{
        id:"",
        tiket:"",
        komentar:"",
        boja:"#ff4646",
        korisnik:""
    }]);
    const[lokacija,SetLokacija]=useState({
        x:20.6011428833,
        y:44.6703948975
    })
    const[ikonica,setIkonica]=useState('https://cdn2.vectorstock.com/i/1000x1000/23/66/pin-location-icon-iconic-design-vector-18322366.jpg')
    const[loginToken,setLoginToken]=useState(false)
    const[korisnik,setKorisnik]=useState({Id:'', ime:'',pravo:''})
    
    return(                                                  
        <TContext.Provider value={{komentari:[komentari,setKomentari],
            lokacija:[lokacija,SetLokacija],
            ikonica:[ikonica,setIkonica],
            loginToken:[loginToken,setLoginToken],
            korisnik:[korisnik,setKorisnik],
         }}>
            {props.children}
        </TContext.Provider>
    )
}