'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {  ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const router = useRouter()
  const [data, setData] = useState(null)

  const fetchData = async () => {
    // List of IDs to scrape
    const ids = [53935, 43114];

    for (const id of ids) {
      try {
        const response = await fetch(`/api/tracker/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('There was a problem with the fetch operation: ', error);
      }
    }
  }

  useEffect(() => {
    const intervalId = setInterval(fetchData, 1800000); // Runs every 30 minutes

    return () => clearInterval(intervalId);
  }, []);
  return (
    <main
      className="min-h-screen  flex items-center justify-center text-white custom-background">
      <section className="p-8 rounded-lg shadow-lg bg-white z-50 text-black">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none bg-gradient-colors bg-clip-text text-transparent md:text-5xl lg:text-6xl ">Track Realtime Gas Price</h1>
          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 ">Here we can track gass price of blockchain</p>
          <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4" onClick={() => router.push('./Track')}>
            <a className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center  bg-white text-black rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4   ">
              continue
              <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </a>
          </div>


        </div>
      </section>
      
    </main>
  );
}