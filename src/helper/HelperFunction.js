const HelperFuntion = () => {
  const url = 'https://mvps.almaks.rs:3001/';
  //const url = 'http://localhost:3004/'
  const DanUNedelji = index => {
    switch (true) {
      case index == 0:
        return 'Nedelja';
        break;
      case index == 1:
        return 'Ponedeljak';
        break;
      case index == 2:
        return 'Utorak';
        break;
      case index == 3:
        return 'Sreda';
        break;
      case index == 4:
        return 'Čevrtak';
        break;
      case index == 5:
        return 'Petak';
        break;
      case index == 6:
        return 'Subota';
        break;
    }
  };
  const MesecUGodini = index => {
    switch (true) {
      case index == 1:
        return 'Januar';
        break;
      case index == 2:
        return 'Februar';
        break;
      case index == 3:
        return 'Mart';
        break;
      case index == 4:
        return 'April';
        break;
      case index == 5:
        return 'Maj';
        break;
      case index == 6:
        return 'Jun';
        break;
      case index == 7:
        return 'Jul';
        break;
      case index == 8:
        return 'Avgust';
        break;
      case index == 9:
        return 'Septembar';
        break;
      case index == 10:
        return 'Oktobar';
        break;
      case index == 11:
        return 'Novembar';
        break;
      case index == 12:
        return 'Decembar';
        break;
    }
  };
  const KonverterVremena = vreme => {
    const zadnjeJavljanje = new Date(vreme * 1000);
    const vremeSad = new Date().getTime();
    let razlika = vremeSad - zadnjeJavljanje;
    razlika = razlika / 1000;
    var seconds = Math.floor(razlika % 60);
    razlika = razlika / 60;
    var minutes = Math.floor(razlika % 60);
    razlika = razlika / 60;
    var hours = Math.floor(razlika % 24);
    var days = Math.floor(razlika / 24);
    return { days: days, hours: hours, minutes: minutes, seconds: seconds };
  };

  const IspisiRazlikuNejavljanja = vreme => {
    const razlika = KonverterVremena(vreme);
    if (razlika.days)
      return {
        vreme: `pre ${razlika.days} dana ${razlika.hours} sati`,
        boja: 'red',
      };
    else if (razlika.hours) {
      return {
        vreme: `pre ${razlika.hours} sati ${razlika.minutes} minuta`,
        boja: 'green',
      };
    } else {
      return {
        vreme: `pre ${razlika.minutes} minuta ${razlika.seconds} sekundi`,
        boja: 'green',
      };
    }
  };
  const KonverterVremenaIzBaze = vreme => {
    const vremeZona = new Date(vreme).toLocaleString('en-GB', {
      timeZone: 'Europe/Belgrade',
    });
    let vreme2 = vremeZona.replace('T', ' ');
    return vreme2.replace('.000Z', '');
  };
  const DodajNuluJEdnocifrenomBroju = broj => {
    if (broj <= 9) return `0${broj}`;
    else {
      return `${broj}`;
    }
  };
  const KonverzijaVremenaStatistika = date => {
    return (
      date.getFullYear().toString() +
      '-' +
      DodajNuluJEdnocifrenomBroju(parseInt(date.getMonth()) + 1).toString() +
      '-' +
      DodajNuluJEdnocifrenomBroju(date.getDate()).toString()
    );
  };
  const KonverzijaVremenaObuka = datum => {
    const date = new Date(datum);
    let returnDate =
      date.getFullYear() +
      '-' +
      DodajNuluJEdnocifrenomBroju(parseInt(date.getMonth()) + 1) +
      '-' +
      DodajNuluJEdnocifrenomBroju(date.getDate()) +
      'T' +
      DodajNuluJEdnocifrenomBroju(date.getHours()) +
      ':' +
      DodajNuluJEdnocifrenomBroju(date.getMinutes());
    return returnDate.replace('.000Z', '');
  };
  const Boje = id => {
    if (!id) return { background: '#FAF9F6' }; //belo
    if (id === 1) return { background: '#FF7F7F' }; //crveno
    if (id === 2) return { background: '#fdfd66' }; //zuto
    if (id === 3) return { background: '#ac72c9' }; //ljubicasto
    if (id === 4) return { background: '#90ee90' }; //zeleno
    if (id === 5) return { background: '#a9a9a9' }; //sivo
    if (id === 6) return { background: '#FFB6C1' }; //pink
  };
  const GetInfoVozilo = async vozilo => {
    const parametri = { idVozilo: vozilo.raw.getId() };
    const data = await (
      await fetch(`${url}vozila`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parametri),
      })
    ).json();
    // if(data.length>0)
    return data;
  };
  const OsveziElementBaze = async (vozilo, vozila) => {
    //ova funkcija se okida samo kada se brise zadnji element starog stejta
    let niz = vozila; //mogla je ona da osvezava stejt kroz celu aplikaciju, ali je ovako odradjeno zbog brzine
    const noviInfo = await GetInfoVozilo(vozilo);
    for (let i = 0; i < niz.length; i++) {
      if (niz[i].unit.id === vozilo.raw.getId())
        niz[i] = { unit: niz[i].unit, bazaInfo: noviInfo };
    }
  };
  const GetAllFirmeILokacije = async () => {
    const data = await (await fetch(`${url}firme/getall`)).json();
    return data;
  };
  const BrisanjeFirmeILokacije = async (Id, naziv) => {
    let result = window.confirm(
      `Da li želite da obrišete lokaciju i firmu ${naziv}?`
    );
    if (!result) return null;
    const data = await (
      await fetch(`${url}firme/delete/${Id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
  };
  const UpdateFirmeILokacije = async (Id, naziv, lokacija) => {
    let result = window.confirm(
      `Da li želite da izmenite lokaciju/naziv firme ${naziv}?`
    );
    if (!result) return null;
    const parametri = { Id: Id, naziv: naziv, lokacija: lokacija };
    const data = await (
      await fetch(`${url}firme/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parametri),
      })
    ).json();
  };
  const UpdateMailFirme = async (Id, mail, naziv) => {
    let result = window.confirm(
      `Da li želite da izmenite mail firme ${naziv}?`
    );
    if (!result) return null;
    const parametri = { Id: Id, mail: mail };
    const data = await (
      await fetch(`${url}firme/updateMail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parametri),
      })
    ).json();
  };
  const InsertFirmaILokacija = async (naziv, lokacija) => {
    const parametri = { naziv: naziv, lokacija: lokacija };
    const data = await (
      await fetch(`${url}firme/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parametri),
      })
    ).json();
    if (data.message.errno == 1062) {
      alert('Ova firma već postoji');
    }
  };
  const GetAllFirmeIKontakte = async () => {
    const data = await (await fetch(`${url}kontakti/getall`)).json();
    return data;
  };
  const UpdateKontaktIBroj = async (IdKontakta, osoba, broj) => {
    let result = window.confirm(
      `Da li želite da izmenite broj telefona osobe ${osoba}?`
    );
    if (!result) return null;
    const parametri = { IdKontakta: IdKontakta, osoba: osoba, broj: broj };
    const data = await (
      await fetch(`${url}kontakti/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parametri),
      })
    ).json();
  };
  const BrisanjeKontakta = async (IdKontakta, osoba) => {
    let result = window.confirm(`Da li želite da obrišete kontakt ${osoba}?`);
    if (!result) return null;
    const data = await (
      await fetch(`${url}kontakti/delete/${IdKontakta}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
  };
  const InsertKontakti = async (idFirme, osoba, broj) => {
    if (!osoba || !broj) {
      alert('Popunite polja!');
      return;
    }
    const parametri = { idFirme: idFirme, osoba: osoba, broj: broj };
    const data = await (
      await fetch(`${url}kontakti/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parametri),
      })
    ).json();
  };
  const UpdateObukeDatumIPredavac = async (
    Id,
    zakazana,
    predavac,
    odrzana,
    naziv
  ) => {
    let result = window.confirm(
      `Da li želite da izmenite zakazan termin/predavaca za firmu ${naziv}?`
    );
    if (!result) return null;
    const parametri = {
      Id: Id,
      zakazana: zakazana,
      predavac: predavac,
      odrzana: odrzana,
    };
    const data = await (
      await fetch(`${url}obuke/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parametri),
      })
    ).json();
  };
  const GetAllFirmeINaloge = async () => {
    const data = await (await fetch(`${url}nalozi/getall`)).json();
    return data;
  };
  const UpdateNalozi = async (
    idNalozi,
    platforma,
    korisnickoIme,
    lozinka,
    firma
  ) => {
    let result = window.confirm(
      `Da li želite da izmenite podatke naloga firme ${firma}?`
    );
    if (!result) return null;
    const parametri = {
      idNalozi: idNalozi,
      platforma: platforma,
      korisnickoIme: korisnickoIme,
      lozinka: lozinka,
    };
    const data = await (
      await fetch(`${url}nalozi/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parametri),
      })
    ).json();
  };
  const InsertNalozi = async (idFirme, platforma, korisnickoIme, lozinka) => {
    if (!korisnickoIme || !lozinka) {
      alert('Popunite polja za korisničko ime i lozinku!');
      return;
    }
    const parametri = {
      idFirme: idFirme,
      platforma: platforma,
      korisnickoIme: korisnickoIme,
      lozinka: lozinka,
    };
    const data = await (
      await fetch(`${url}nalozi/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parametri),
      })
    ).json();
  };
  const VratiSveUsere = async () =>
    await (await fetch(`${url}nalozi/users`)).json();

  const VratiKomentarePoDanuIkorisniku = async (
    filter,
    odDatum,
    korisnik,
    boja
  ) => {
    const parametri = { odDatum: odDatum, korisnik: korisnik, boja: boja };
    try {
      const data = await (
        await fetch(`${url}statistika/${filter}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(parametri),
        })
      ).json();
      return data;
    } catch (err) {
      alert(err);
    }
  };
  const ProveraObuke = async () => {
    try {
      const data = await (await fetch(`${url}obuke/notifikacija`)).json();
      return data;
    } catch (err) {
      alert(err);
    }
  };

  return {
    IspisiRazlikuNejavljanja,
    Boje,
    GetInfoVozilo,
    OsveziElementBaze,
    GetAllFirmeILokacije,
    BrisanjeFirmeILokacije,
    UpdateFirmeILokacije,
    InsertFirmaILokacija,
    GetAllFirmeIKontakte,
    UpdateMailFirme,
    UpdateKontaktIBroj,
    BrisanjeKontakta,
    InsertKontakti,
    KonverterVremenaIzBaze,
    UpdateObukeDatumIPredavac,
    GetAllFirmeINaloge,
    UpdateNalozi,
    InsertNalozi,
    VratiSveUsere,
    VratiKomentarePoDanuIkorisniku,
    KonverzijaVremenaStatistika,
    DanUNedelji,
    MesecUGodini,
    DodajNuluJEdnocifrenomBroju,
    KonverzijaVremenaObuka,
    ProveraObuke,
  };
};
export default HelperFuntion;
