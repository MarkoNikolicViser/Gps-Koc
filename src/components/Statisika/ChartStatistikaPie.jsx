import React, { useState,useContext } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import {TContext} from '../context'

ChartJS.register(ArcElement, Tooltip, Legend);

export function ChartStatistikaPie({ dataBaza }) {
    const Zbir = () => {
        if (!dataBaza.length)
            return
        let zbir = 0;
        for (let i = 0; i <= 3; i++) {
            zbir += dataBaza[i].chart.reduce((a, b) => a + b, 0)
        }
        return dataBaza.length > 0 ? zbir : 0
    }
    const InfoIzBaze = () => dataBaza.length > 0 ? dataBaza[4].chart.reduce((a, b) => a + b, 0) : 0
    const data = {
        labels: ['Svi pozivi', 'Info iz baze'],
        datasets: [
            {
                label: '# of Votes',
                data: [Zbir(), InfoIzBaze()],
                backgroundColor: [
                    'white',
                    '#a9a9a9',
                ],
                borderColor: [
                    'gray',
                ],
                borderWidth: 1,
            },
        ],
    };
    return <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
        <div style={{ width: '300px', height: '300px', paddingBottom: '5%', paddingTop: '5%' }}>
            <Pie height={500} data={data} />
        </div>
        <div style={{ display: 'flex', height: '300px' }}>
            {dataBaza.map((m, index) => (
                <NizElemenata key={index} niz={m.data} counter={index + 1} />
            ))}
        </div>
    </div>
}
const NizElemenata = ({ niz, counter }) => {


    return <div style={counter == 1 ? { background: '#FF7F7F' } : counter == 2 ? { background: '#fdfd66' } : counter == 3 ? { background: '#cf9fe5' } : counter == 4 ? { background: '#90ee90' } : { background: '#a9a9a9' }}>
        {niz.length?<div style={{ height: '100%', overflowY: 'scroll' }}>
            {niz.length > 0 ?
                niz.map((m, index) => (
                    <Element key={index} index={index} element={m}/>
                )) : null}
        </div>:null}
    </div>
}
const Element = ({index,element}) => {
    const {svaVozilaC}=useContext(TContext)
    const [svaVozilaCValue,setSvaVozilaCValue]=svaVozilaC
    const [hover, setHover] = useState(false)

    const filter=svaVozilaCValue.filter(a=>a.id==element.idVozilo)

    return <div style={{ display: 'flex', flexDirection: 'column', minWidth: '150px', border: '1px solid gray', marginBottom: '1px' }}>
        {!hover ? <div onMouseOver={() => setHover(prev => prev = !prev)} style={{ display: 'flex' }}>
            <h1 style={{ width: '15px', fontWeight: '700' }}>{index + 1}.</h1>
            <h1 style={{ fontWeight: '500' }}>{element.komentar}</h1>
        </div> :
            <div onMouseLeave={() => setHover(prev => prev = !prev)} style={{ background: 'white' }}>
                <h1 style={{ fontWeight: '500' }}>{filter[0].name}</h1>
            </div>
        }
    </div>
}
