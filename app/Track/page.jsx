"use client"
import React, { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Package2Icon(props) {
    return (
        (<svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M3 9h18v10a2 2 0 1-2 2H5a2 1-2-2V9Z" />
            <path d="m3 9 2.45-4.9A2 2 0 1 7.24 3h9.52a2 1.8 1.1L21" />
            <path d="M12 3v6" />
        </svg>)
    );
}
function convertTimestampToDate(timestamp) {
    const seconds = timestamp?.seconds;
    const nanoseconds = timestamp?.nanoseconds;
    const milliseconds = seconds * 1000 + nanoseconds / 1000000;
    const date = new Date(milliseconds);
    const dateOnlyString = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeOnlyString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    return { date: dateOnlyString, time: timeOnlyString };

}

const page = () => {
    const [chainId, setChainId] = useState(null);
    const [data, setData] = useState(null);
    const [selected, setSelected] = useState(0);
    const handleClick = (chain_data) => {
        if (!chain_data) {
            return
        }
        fetch(`/api/getDb`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    chainID: chain_data
                }

            }),
        }).then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                const { date, time } = convertTimestampToDate(data?.data?.created_at)
                const newData = { ...data, date, time, fetchedTime: new Date().getTime() };

                let fetchedData = JSON.parse(localStorage.getItem('fetchedData')) || [];

                fetchedData.push(newData);

                localStorage.setItem('fetchedData', JSON.stringify(fetchedData));

                setData(fetchedData);

                toast.success('data fetched successfully', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light"
                });
            }).catch((error) => {
                console.error('Error:', error);

                toast.warn('data fetching failed', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light"
                });
            });
    }

    console.log(data)

    useEffect(() => {
        handleClick(chainId)
        setChainId(null);
    }, [chainId])

    useEffect(() => {
        const fetchedData = JSON.parse(localStorage.getItem('fetchedData'));
        if (fetchedData) {
            // Get the last item from the array
            // const data = fetchedData[fetchedData.length - 1];
            setData(fetchedData);
        }
    }, [])


    return (
        <div className="flex flex-col min-h-screen w-full">

            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex items-center">
                    <h1 className="font-semibold text-lg md:text-2xl">Blockchain Transactions</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-medium text-sm md:text-base">fetch Chain:</span>
                    <div className="flex gap-2">
                        <Button onClick={() => { setChainId("53935") }}>DFK</Button>
                        <Button onClick={() => { setChainId("43114") }}>C-Chain</Button>
                        <Button onClick={() => { localStorage.removeItem('fetchedData'); setData(null) }} className="bg-red-500 hover:bg-red-400">clear</Button>
                    </div>
                </div>
                <div className="border shadow-sm rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">chain ID</TableHead>
                                <TableHead className="max-w-[150px]">Gas Price</TableHead>
                                <TableHead className="hidden md:table-cell"> Scarped Date</TableHead>
                                <TableHead>scraped Time</TableHead>
                                <TableHead>fetched Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data && data?.map((item, index) => (
                                <TableRow key={index} onClick={() => { setSelected(index) }} className={selected === index ? "bg-green-200 border-green-400" : ""}>
                                    <TableCell className="font-medium">{item?.data?.chainID}</TableCell>
                                    <TableCell>{item?.data?.median || "..."}</TableCell>
                                    <TableCell className="hidden md:table-cell">{item?.date}</TableCell>
                                    <TableCell>{item?.time}</TableCell>
                                    <TableCell>{new Date(item?.fetchedTime).toLocaleString()}</TableCell>
                                </TableRow>
                            ))
                            }
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-4">
                    <h2 className="font-semibold text-lg md:text-xl">{`Median Gas Price: ${(data && data[selected] && data[selected].data?.median)?.toFixed(10)}`}</h2>
                </div>
            </main>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    )
}

export default page