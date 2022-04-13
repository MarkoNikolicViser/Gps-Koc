import React, { useEffect, useState } from 'react';
import HelperFuntion from '../../helper/HelperFunction';

export const ListaTrajnih = ({ idVozilo }) => {
  const [noviTrajni, setNoviTrajni] = useState('');
  const [trajni, setTrajni] = useState([]);
  const { GetTrajniInfo, InsertTrajniInfo } = HelperFuntion();

  useEffect(() => {
    let cleanUp = true;
    if (cleanUp)
      (async () => {
        setTrajni(await GetTrajniInfo(idVozilo));
      })();
    return () => {
      cleanUp = false;
      setTrajni([]);
    };
  }, []);
  const Insert = async () => {
    await InsertTrajniInfo(idVozilo, noviTrajni);
    setTrajni(await GetTrajniInfo(idVozilo));
    setNoviTrajni('');
  };

  return (
    <div
      style={{
        maxHeight: '100px',
        overflowY: 'scroll',
        marginBottom: '10px',
        border: '2px solid black',
        boxShadow: '4px 4px 4px 4px #888888',
      }}
    >
      <table>
        <thead style={{ fontSize: '10px' }}>
          <tr>
            <th>
              <input
                placeholder='Nova trajna informacija'
                onChange={e => setNoviTrajni(e.target.value)}
                value={noviTrajni}
                type='text'
              />
            </th>
            <th>
              <button
                disabled={!noviTrajni.length}
                style={{ width: '35px' }}
                onClick={Insert}
              >
                +
              </button>
            </th>
          </tr>
          {trajni.length ? (
            <tr>
              <th>Trajna info</th>
              <th>Ukloni</th>
            </tr>
          ) : null}
        </thead>
        <tbody>
          {trajni.map((m, index) => (
            <Row
              setTrajni={setTrajni}
              idVozilo={idVozilo}
              key={index}
              element={m}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
const Row = ({ element, idVozilo, setTrajni }) => {
  const { DeleteTrajniInfo, GetTrajniInfo } = HelperFuntion();
  const obrisi = (
    <svg
      //   style={{ display: 'flex', alignItems: 'center' }}
      //   className='kanta'
      xmlns='http://www.w3.org/2000/svg'
      width='12'
      height='12'
      viewBox='0 0 24 24'
    >
      <path d='M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z' />
    </svg>
  );
  const Obrisi = async () => {
    await DeleteTrajniInfo(element.info, element.id);
    setTrajni(await GetTrajniInfo(idVozilo));
  };
  return (
    <tr>
      <td style={{ color: 'black', fontWeight: '900' }}>{element.info}</td>
      <td onClick={Obrisi}>{obrisi}</td>
    </tr>
  );
};
