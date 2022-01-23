

const HelperFuntion = () => {
    //const url='https://mvps.almaks.rs:3001/'
    const url='http://localhost:3001/'

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
        const data = await (await fetch(`${url}vozila`, {
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
    const GetAllFirmeILokacije=async()=>{
        const data=await(await fetch(`${url}firme/getall`)).json()
        return data;
    }
    const BrisanjeFirmeILokacije=async(Id,naziv)=>{
        let result = window.confirm(`Da li želite da obrišete lokaciju i firmu ${naziv}?`);
        if(!result)
        return null
        const data = await (await fetch(`${url}firme/delete/${Id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }})).json();
    }
    const UpdateFirmeILokacije = async (Id,naziv,lokacija) => {
        let result = window.confirm(`Da li želite da izmenite lokaciju/naziv firme ${naziv}?`);
        if(!result)
        return null
        const parametri = { Id:Id, naziv:naziv, lokacija:lokacija };
        const data = await (await fetch(`${url}firme/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parametri)
        })).json();
    }
    const UpdateMailFirme= async (Id,mail,naziv) => {
        let result = window.confirm(`Da li želite da izmenite mail firme ${naziv}?`);
        if(!result)
        return null
        const parametri = { Id:Id, mail:mail};
        const data = await (await fetch(`${url}firme/updateMail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parametri)
        })).json();
    }
    const InsertFirmaILokacija = async (naziv,lokacija) => {
        const parametri = {naziv:naziv, lokacija:lokacija };
        const data = await (await fetch(`${url}firme/insert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parametri)
        })).json();
        if(data.message.errno==1062){
            alert('Ova firma već postoji')
        }
    }
    const GetAllFirmeIKontakte=async()=>{
        const data=await(await fetch(`${url}kontakti/getall`)).json()
        return data;
    }
    const UpdateKontaktIBroj= async (IdKontakta,osoba,broj) => {
        let result = window.confirm(`Da li želite da izmenite broj telefona osobe ${osoba}?`);
        if(!result)
        return null
        const parametri = { IdKontakta:IdKontakta,osoba:osoba,broj:broj};
        const data = await (await fetch(`${url}kontakti/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parametri)
        })).json();
    }
    const BrisanjeKontakta=async(IdKontakta,osoba)=>{
        let result = window.confirm(`Da li želite da obrišete kontakt ${osoba}?`);
        if(!result)
        return null
        const data = await (await fetch(`${url}kontakti/delete/${IdKontakta}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }})).json();
    }
    const InsertKontakti = async (idFirme,osoba,broj) => {
        if(!osoba||!broj){
            alert('Popunite polja!')
            return
        }
        const parametri = {idFirme:idFirme, osoba:osoba, broj:broj};
        const data = await (await fetch(`${url}kontakti/insert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parametri)
        })).json();
    }
    return { IspisiRazlikuNejavljanja, Boje, GetInfoVozilo,OsveziElementBaze,GetAllFirmeILokacije,BrisanjeFirmeILokacije,UpdateFirmeILokacije,InsertFirmaILokacija,GetAllFirmeIKontakte,UpdateMailFirme,UpdateKontaktIBroj,BrisanjeKontakta,InsertKontakti }
}
export default HelperFuntion;