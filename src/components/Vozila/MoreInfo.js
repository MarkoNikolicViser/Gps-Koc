import React, { useState, useEffect, useContext } from 'react';
import HelperFuntion from '../../helper/HelperFunction';
import { TContext } from '../context';
import ListaKomentara from './ListaKomentara';
import { ListaTrajnih } from './ListaTrajnih';

const MoreInfo = ({
  vozila,
  setVozila,
  vozilo,
  idVozilo,
  idUredjaja,
  nazivUredjaja,
  lokacija,
  razlika,
  vreme,
  sateliti,
  x,
  y,
  brzinaCan,
  brzina,
  kilometraza,
  kilometrazaCan,
  senzori,
  ObojRed,
  bazaInfo,
  bazaInfoNew,
  setBazaInfoNew,
  broj,
  granica,
  setSvaInfoVozila,
  init,
}) => {
  //////////////////////////////
  const { korisnik, url } = useContext(TContext);
  const [korisnikValue, setKorisnikValue] = korisnik;
  /////////////////////////////
  const { Boje, GetInfoVozilo, VratiSveInfoVozilo } = HelperFuntion();
  const [bojaSelecta, setBojaSelecta] = useState('DEFAULT');
  const [komentar, setKomentar] = useState('');

  const InsertKomentar = async () => {
    if (!komentar.length) {
      alert('Morate popuniti polje za komentar');
      return null;
    }
    if (bojaSelecta === 'DEFAULT') {
      alert('Morate odabrati boju');
      return null;
    }
    const parametri = {
      idVozilo: idVozilo,
      komentar: komentar,
      boja: bojaSelecta,
      korisnik: korisnikValue.Id,
    };
    const data = await (
      await fetch(`${url}komentar/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parametri),
      })
    ).json();
    setKomentar('');
    setBojaSelecta('DEFAULT');
    setBazaInfoNew(await GetInfoVozilo(idVozilo));
    setSvaInfoVozila(await VratiSveInfoVozilo());
  };
  return (
    <div
      style={{ ...ObojRed, position: 'absolute', zIndex: 1, width: '99%' }}
      className='more-info'
    >
      {granica ? <h4>Prelazak granice</h4> : null}
      <div>
        {vreme} ({razlika})
      </div>
      <div>{lokacija}</div>
      <ListaTrajnih idVozilo={idVozilo} />
      <table style={{ background: '#FAF9F6', marginTop: '-0.5px' }}>
        <tbody>
          <tr>
            {brzinaCan != 'N/A' ? (
              <td>{brzinaCan} km/h</td>
            ) : (
              <td>{brzina} km/h</td>
            )}
            {kilometrazaCan != 'N/A' ? (
              <td>{kilometrazaCan} km</td>
            ) : (
              <td>{kilometraza} km</td>
            )}
            {sateliti !== 255 && sateliti ? (
              <td>
                <svg
                  style={{ fill: 'gray' }}
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                >
                  <path d='M6.15 5.218l10.618 10.617c-6.542.955-11.588-3.958-10.618-10.617zm-1-3.829c-4.398 10.774 4.776 19.805 15.444 15.443l-15.444-15.443zm-3.15 22.611h2.949c1-.923 2.004-2 3.551-2s2.551 1.077 3.551 2h2.949l-6.5-6-6.5 6zm11.081-17.493l2.411 2.412c.666-.666.666-1.746 0-2.412s-1.745-.666-2.411 0zm.919-6.507v1.592c3.783 0 6.408 2.584 6.408 6.408h1.592c0-4.734-3.362-8-8-8zm0 3.014v1.605c2.13 0 3.381 1.242 3.381 3.381h1.605c0-3.017-1.966-4.986-4.986-4.986z' />
                </svg>
                {sateliti}
              </td>
            ) : null}
            <td style={{ wordSpacing: '9px', width: '25px' }}>
              {x} {y}
            </td>
          </tr>
        </tbody>
      </table>
      <div
        style={{
          display: 'flex',
          border: '1px solid gray',
          padding: '1px',
          marginTop: '10px',
          background: '#FAF9F6',
        }}
      >
        <div>
          <div
            style={{
              margin: '1px',
              padding: '0.5px',
              border: '0.5px solid gray',
              display: 'flex',
            }}
          >
            <h6>Id:</h6> <h6 style={{ fontWeight: '100' }}>{idUredjaja}</h6>
          </div>
          {senzori.map((m, index) =>
            index % 2 == 0 ? (
              <div
                style={{
                  margin: '1px',
                  padding: '0.5px',
                  border: '0.5px solid gray',
                  display: 'flex',
                }}
                key={index}
              >
                <h6>{m.senzor}:</h6>{' '}
                <h6 style={{ fontWeight: '100' }}>{m.vrednost}</h6>
              </div>
            ) : null
          )}
        </div>
        <div>
          <div
            style={{
              margin: '1px',
              padding: '0.5px',
              border: '0.5px solid gray',
              display: 'flex',
            }}
          >
            <h6>Uređaj:</h6>
            {nazivUredjaja ? (
              <h6 style={{ fontWeight: '100' }}>{nazivUredjaja}</h6>
            ) : (
              <h6>Učitavam...</h6>
            )}
          </div>
          <div
            style={{
              margin: '1px',
              padding: '0.5px',
              border: '0.5px solid gray',
              display: 'flex',
            }}
          >
            <h6>Broj:</h6> <h6 style={{ fontWeight: '100' }}>{broj}</h6>
          </div>
          {senzori.map((m, index) =>
            index % 2 != 0 ? (
              <div
                style={{
                  margin: '1px',
                  padding: '0.5px',
                  border: '0.5px solid gray',
                  display: 'flex',
                }}
                key={index}
              >
                <h6>{m.senzor}:</h6>{' '}
                <h6 style={{ fontWeight: '100' }}>{m.vrednost}</h6>
              </div>
            ) : null
          )}
        </div>
      </div>
      <table style={{ fontSize: '10px', width: '97%', background: '#FAF9F6' }}>
        <thead>
          <tr>
            <th>komentar</th>
            <th>boja</th>
            {/* <th>sklopka</th>
                    <th>sleep mode</th> */}
            <th>sačuvaj</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                value={komentar}
                onChange={e => setKomentar(e.target.value)}
                style={{ width: '100%' }}
                type='text'
              />
            </td>
            <td>
              <select
                className='boje-select'
                value={bojaSelecta}
                name=''
                style={Boje(parseInt(bojaSelecta))}
                onChange={e => setBojaSelecta(e.target.value)}
                id=''
              >
                <option disabled value='DEFAULT'>
                  Boja
                </option>
                <option style={{ background: '#FF7F7F' }} value='1'></option>
                <option style={{ background: '#fdfd66' }} value='2'></option>
                <option style={{ background: '#8739ad' }} value='3'></option>
                <option style={{ background: '#90ee90' }} value='4'></option>
                <option style={{ background: '#a9a9a9' }} value='5'></option>
                <option style={{ background: '#FFB6C1' }} value='6'></option>
                <option style={{ background: '#5dc8ef' }} value='7'></option>
              </select>
            </td>
            {/* <td>
                        <select name="" id="">
                            <option value="">da</option>
                            <option value="">ne</option>
                        </select>
                    </td>
                    <td>
                        <select name="" id="">
                            <option value="">da</option>
                            <option value="">ne</option>
                        </select>
                    </td> */}
            <td
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                onClick={InsertKomentar}
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
              >
                <path d='M21.856 10.303c.086.554.144 1.118.144 1.697 0 6.075-4.925 11-11 11s-11-4.925-11-11 4.925-11 11-11c2.347 0 4.518.741 6.304 1.993l-1.422 1.457c-1.408-.913-3.082-1.45-4.882-1.45-4.962 0-9 4.038-9 9s4.038 9 9 9c4.894 0 8.879-3.928 8.99-8.795l1.866-1.902zm-.952-8.136l-9.404 9.639-3.843-3.614-3.095 3.098 6.938 6.71 12.5-12.737-3.096-3.096z' />
              </svg>{' '}
            </td>
          </tr>
        </tbody>
      </table>
      <table
        style={{
          fontSize: '10px',
          width: '97%',
          maxHeight: '100px',
          overflow: 'none',
          background: '#FAF9F6',
          textAlign: 'center',
        }}
      >
        <thead>
          <tr>
            <th>Komentar</th>
            <th>Korisnik</th>
            <th>Datum</th>
            {/* <th>Edit</th> */}
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {bazaInfoNew.length > 0 &&
            bazaInfoNew.map((m, index) => (
              <ListaKomentara
                key={index}
                vozila={vozila}
                setVozila={setVozila}
                info={m}
                setBazaInfoNew={setBazaInfoNew}
                bazaInfo={bazaInfo}
                vozilo={vozilo}
                setSvaInfoVozila={setSvaInfoVozila}
                init={init}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
};
export default MoreInfo;
