import React, {Fragment, useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import {Pagination} from "./Pagination";

type getCardsResponseType = {

    "id": number,
    "firstName": string,
    "lastName": string,
    "email": string,
    "phone": string,
    "address": {
        "streetAddress": string,
        "city": string,
        "state": string,
        "zip": string
    }
}
const getURL = 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}'

type TableKeysType = "id" | "firstName" | "lastName" | "email" | "phone";

type TableHeaderParams = {
    title: TableKeysType,
    sortKey: null | TableKeysType,
    reverseSort: boolean,
    onSortCreator: (key: TableKeysType) => () => void,
    onReverse: () => void
};

function TableHeader(props: TableHeaderParams) {
    return <span>{props.title}
        {
            props.sortKey !== props.title || props.reverseSort ?
                <button onClick={props.onSortCreator(props.title)}>↓</button>
                : <button onClick={props.onReverse}>↑</button>
        }
          </span>;
}

function App() {
    const [data, setData] = useState<getCardsResponseType[]>([])
    const [reverseSort, setReverseSort] = useState(false)
    const [sortKey, setSortKey] = useState<TableKeysType | null>(null)
    const [page,setPage] = useState(1)
    const perPage = 50
    const numberOfPages = Math.ceil(data.length / perPage)

    useEffect(() => {
        axios.get<getCardsResponseType[]>(getURL)
            .then((res) => {
                    setData(res.data.map(m =>
                        res.data.find((f) => f.id === m.id) === m ? m
                            : {
                                ...m,
                                id: Math.floor(Math.random() * 100000 + 1000)
                            }))
                }
            )
    }, [])
    const displayedData = [...data]
    if (sortKey)
        displayedData.sort((a, b) => {
            if (reverseSort)
                return a[sortKey] > b[sortKey] ? -1 : 1
            else return a[sortKey] > b[sortKey] ? 1 : -1
        })


    const sortCreator = (key: TableKeysType) => () => {
        setReverseSort(false)
        setSortKey(key)
    };
    const onReverseSort = () => {
        setReverseSort(true)
    };
    const tableHeaders: TableKeysType[] = ["id", "firstName", "lastName", "email", "phone"];
    return (
        <div className="App">
            <div className={"table-container"}>
                {tableHeaders.map(m => <TableHeader key={m} title={m} sortKey={sortKey} reverseSort={reverseSort}
                                                    onSortCreator={sortCreator}
                                                    onReverse={onReverseSort}/>)}
                {/*<span>firstName*/}
                {/*    {*/}
                {/*        sortKey !== "firstName" || reverseSort ? <button onClick={sortCreator("firstName")}>↓</button>*/}
                {/*            : <button onClick={onReverseSort}>↑</button>*/}
                {/*    }</span>*/}
                {/*<span>lastName </span>*/}
                {/*<span>email </span>*/}
                {/*<span>phone</span>*/}
                {displayedData.slice((page - 1)*perPage, perPage*page).map(m =>
                    <Fragment key={m.id}>
                        <span>{m.id} </span>
                        <span>{m.firstName} </span>
                        <span>{m.lastName} </span>
                        <span>{m.email} </span>
                        <span>{m.phone}</span>
                    </Fragment>)}
            </div>
            <Pagination numberOfPages={numberOfPages} currentPage={page} changePage={setPage}/>
        </div>
    );
}


export default App;
