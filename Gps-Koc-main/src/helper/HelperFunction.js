import React from "react";


const HelperFuntion = () => {

    const KonverterVremena = (vreme) => {
        const zadnjeJavljanje = new Date(vreme * 1000)
        const vremeSad = new Date().getTime()
        let razlika = vremeSad - zadnjeJavljanje;
        razlika = razlika / 1000;
        var seconds = Math.floor(razlika % 60);
        razlika = razlika / 60;
        var minutes = Math.floor(razlika % 60);
        razlika = razlika / 60;
        var hours = Math.floor(razlika % 24);
        var days = Math.floor(razlika / 24);
        return { days: days, hours: hours, minutes: minutes, seconds: seconds }
    }

    const IspisiRazlikuNejavljanja = (vreme) => {
        const razlika = KonverterVremena(vreme)
        if (razlika.days)
            return { vreme: `pre ${razlika.days} dana ${razlika.hours} sati`, boja: 'red' };
        else if (razlika.hours) {
            return { vreme: `pre ${razlika.hours} sati ${razlika.minutes} minuta`, boja: 'green' };
        }
        else {
            return { vreme: `pre ${razlika.minutes} minuta ${razlika.seconds} sekundi`, boja: 'green' };
        }
    }
    const Boje = (id) => {
        if (!id)
            return { background: '#FAF9F6' } //belo
        if (id === 1)
            return { background: '#FF7F7F' }//crveno
        if (id === 2)
            return { background: '#fdfd66' }//zuto
        if (id === 3)
            return { background: '#cf9fe5' }//ljubicasto
        if (id === 4)
            return { background: '#90ee90' }//zeleno
        if (id === 5)
            return { background: '#a9a9a9' }//sivo
    }
    const GetInfoVozilo = async (vozilo) => {
        const parametri = { idVozilo: vozilo.raw.getId() };
        const data = await (await fetch('https://mvps.almaks.rs:3001/vozila', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parametri)
        })).json();
        // if(data.length>0)
        return data
    }
    const OsveziElementBaze=async(vozilo,vozila)=>{ //ova funkcija se okida samo kada se brise zadnji element starog stejta
        let niz=vozila                              //mogla je ona da osvezava stejt kroz celu aplikaciju, ali je ovako odradjeno zbog brzine
        const noviInfo=await GetInfoVozilo(vozilo)
        for(let i=0;i<niz.length;i++){
            if(niz[i].unit.id===vozilo.raw.getId())
            niz[i]={unit:niz[i].unit, bazaInfo:noviInfo}
        }
    }

    return { IspisiRazlikuNejavljanja, Boje, GetInfoVozilo,OsveziElementBaze }
}
export default HelperFuntion;