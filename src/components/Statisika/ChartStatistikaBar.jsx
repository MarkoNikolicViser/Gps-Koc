import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import HelperFuntion from '../../helper/HelperFunction';
import { ChartStatistikaPie } from './ChartStatistikaPie';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    scales: {
        y: {
            ticks: {
                stepSize: 1
            }
        }
    },
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Izveštaj aktivnosti korisnika',
        },
    },
};

export const ChartStatistikaBar = ({ opcija, datum, user }) => {

    const { VratiKomentarePoDanuIkorisniku, DanUNedelji, MesecUGodini } = HelperFuntion()
    const [dataBaza, setDataBaza] = useState([{ chart: [], data: [] }, { chart: [], data: [] }, { chart: [], data: [] }, { chart: [], data: [] }, { chart: [], data: [] }])
    const [labelFilter, setLabelFilter] = useState({ sedmica: [], mesec: [], godina: [] })

    useEffect(() => {
        const date = new Date(datum.dan)
        let nizSedmica = []
        date.setDate(date.getDate() + 1)
        for (let i = 0; i < 7; i++) {
            date.setDate(date.getDate() - 1)
            nizSedmica.push(`${DanUNedelji(date.getDay())} ${date.getDate()}.${date.getMonth() + 1}`)
        }
        // setLabelFilter({...labelFilter,sedmica:nizSedmica.reverse()})
        let nizMesec = []
        const date2 = new Date(datum.dan)
        date2.setDate(date2.getDate() + 1)
        for (let i = 0; i < 31; i++) {
            date2.setDate(date2.getDate() - 1)
            nizMesec.push(`${date2.getDate()}.${date2.getMonth() + 1}`)
        }
        let nizGodina = []
        const date3 = new Date(datum.mesec)
        date3.setMonth(date3.getMonth() + 1)
        for (let i = 0; i < 12; i++) {
            date3.setMonth(date3.getMonth() - 1)
            nizGodina.push(`${MesecUGodini(date3.getMonth() + 1)} ${date3.getUTCFullYear()}`)
        }
        setLabelFilter({ ...labelFilter, mesec: nizMesec.reverse(), sedmica: nizSedmica.reverse(), godina: nizGodina.reverse() })
    }, [datum])

    useEffect(() => {
        //let cleanUp = true
        // if (cleanUp)
        (async () => {
            let niz = []
            for (let i = 1; i < 6; i++) {
                let data = await VratiKomentarePoDanuIkorisniku(opcija == 1 ? 'dan' : opcija == 2 ? 'sedmica' : opcija == 3 ? 'mesec' : 'godina', opcija != 4 ? datum.dan : datum.mesec, user, i)
                console.log(data)
                niz.push(data)
            }
            setDataBaza(niz)
        })()
        //return () => { cleanUp = false; setDataBaza([]) }
    }, [datum, user, opcija])

    const labels = opcija == 4 ? labelFilter.godina
        : opcija == 3 ? labelFilter.mesec
            : opcija == 2 ? labelFilter.sedmica : ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']


    const data = {
        labels,
        datasets: [
            {
                label: 'Nisu se javili',
                data: dataBaza[0].chart,
                backgroundColor: '#FF7F7F',
            },
            {
                label: 'Otvoren tiket',
                data: dataBaza[1].chart,
                backgroundColor: '#fdfd66',
            },
            {
                label: 'Potvrđena informacija',
                data: dataBaza[2].chart,
                backgroundColor: '#cf9fe5',
            },
            {
                label: 'Pozvati ponovo',
                data: dataBaza[3].chart,
                backgroundColor: '#90ee90',
            },
            {
                label: 'Info iz baze',
                data: dataBaza[4].chart,
                backgroundColor: '#a9a9a9',
            },
        ],
    };


    return <>
        <Bar options={options} data={data} />
        <ChartStatistikaPie dataBaza={dataBaza} user={user} opcija={opcija} />
    </>
}
