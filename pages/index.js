import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useEffect, useState} from 'react'
import axios from 'axios';

export default function Home(props) {
    console.log(props)
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


    const getData =  () => {
        try {

            const items = props.vinnArr.map(async (el, i) => {
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
                <title>Fuel-WOG</title>
                <meta name="Check Fuel" content="Fuel-WOG"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>


            <h1 className={styles.title}>
                Паливо Вінниця WOG v1.0
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

export async function getServerSideProps(context) {


        const res = await fetch('https://api.wog.ua/fuel_stations');
        const {data}= await res.json();
        const {stations} = data
    // console.log(stations)
const foo=[];
        const vinnArr = stations?.filter(el => el?.city === "Вінниця");
        vinnArr.forEach(async (el, i) => {
          await   fetch(el?.link).then(data=>foo.push(data.json()));
            // const {data} =  res.json()
            // foo.push(data)
            // console.log('--------------->data',data)
            // return data;
           //  const list = {
           //      schedule: data?.data.schedule[0],
           //      city: data?.data?.city,
           //      adress: data?.data?.name,
           //      desk: data?.data?.workDescription?.split(/\r?\n/),
           //      coord: data?.data?.coordinates,
           //  }
           // return list
        })
    return {
        props:{
            data,
            vinnArr,
            stations,
            foo
            // items
        }, // will be passed to the page component as props
    }
}
