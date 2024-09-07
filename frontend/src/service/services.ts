import {RestApi} from "./api";
import {Event, Service} from "./models";

const eventsList: Array<Event> = [
    {
        title: 'Всероссийские физкультурные соревнования по конкуру для всадников на лошадях буденовской и донской породы "Золотой пьедистал" : мужчины/женщины (LL); мужчины/женщины на лошади до 6 лет; юноши/девушки 14-18 лет (LL).',
        timestamp: new Date('2024-09-01'),
    },
    {
        title: 'Кубок Республики Татарстан по выездке',
        timestamp: new Date('2024-09-06'),
    },
    {
        title: 'Осенний Кубок КСК «Дивный» по конкуру',
        timestamp: new Date('2024-09-21'),
    },
    {
        title: 'Региональные соревнования по выездке',
        timestamp: new Date('2024-09-30'),
    },
]

const servicesList: Array<Service> = [
    {
        title: 'Конные прогулки по живописному лесу',
        price: 1200,
    },
    {
        title: 'Обучение верховой езде для взрослых и детей от 2-х лет',
        price: 1500,
    },
    {
        title: 'Фотосессии с лошадьми',
        price: 1000,
    },
    {
        title: 'Экскурсии на конюшню',
        price: 800,
    },
    {
        title: 'Подарочный сертификат на 1000 руб',
        price: 1000,
    },
    {
        title: 'Подарочный сертификат на 2000 руб',
        price: 2000,
    },
]

// export const api = new StorageApi(window.localStorage, eventsList, servicesList)
export const api = new RestApi(process.env.REACT_APP_API ?? '', window.localStorage, eventsList, servicesList)
