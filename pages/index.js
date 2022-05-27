import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useEffect, useState} from 'react'
import axios from 'axios';

export default function Home() {

    useEffect(() => {
        getData();
    }, [])

    const [fuelList, setFuelList] = useState([]);
    const isFuel = (el) => {
        const foo = (el.includes('відсутнє'));
        return foo ? null : el;
    }

    const isColor = (el) => {
        const foo = (el?.join('').includes('Готівка', 'банк.картки', 'Талони'));
        return foo ? 'rgba(100,255,65,0.55)' : 'rgba(0,0,0,0.08)';
    }


    const getData = async () => {
        try {
            const {data} = await axios.get('https://api.wog.ua/fuel_stations');
            const {stations} = data?.data;
            const vinnArr = stations?.filter(el => el?.city === "Vinnytsia");
            const items = vinnArr.map(async (el, i) => {
                const {data} = await axios.get(el?.link);
                const list = {
                    schedule: data?.data.schedule[0],
                    city: data?.data?.city,
                    adress: data?.data?.name,
                    desk: data?.data?.workDescription?.split(/\r?\n/),
                    coord: data?.data?.coordinates,
                }
                setFuelList(prev => [...prev, list]);
            })

        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <meta name="Check Fuel" content="Fuel-WOG"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>


            <h1 className={styles.title}>
                Паливо Вінниця WOG
            </h1>

            <div>
                {fuelList.map(el => (
                    <div key={el.coord.latitude} style={{backgroundColor: isColor(el?.desk)}}
                         className={styles.wrapItem}>
                        <h3> {el?.adress}</h3>
                        <p className={styles.interval}>{el.schedule.interval}</p>
                        {el?.desk?.map((item, i) => <p key={i}>{isFuel(item)}</p>)}
                    </div>
                ))}
            </div>

        </div>
    )
}
