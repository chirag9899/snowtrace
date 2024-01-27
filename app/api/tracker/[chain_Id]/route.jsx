import { NextResponse } from "next/server";
import puppeteer from 'puppeteer';
// import { arrayUnion } from "firebase/firestore";

export const POST = async (request, { params }) => {
  try {
    const chainId = params.chain_Id;

    if (chainId === undefined || /^[a-zA-Z]+$/.test(chainId)) {
      return NextResponse.json({ error: "chain_Id undefined" }, { status: 400 });
    }


    //suppoted chain condition 

    const url = `https://snowtrace.io/txs?sort=desc&chain_filter=${chainId}`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);

    // Wait for the '.td.gas' element to load
    await page.reload();
    await page.click('.text-primary.break-all.link');
    await page.waitForSelector('.td.gas');

    const gasColumns = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('.td.gas'));
      return elements.map(element => element.textContent.trim());
    });

    const gasColumnsNumber = gasColumns.map(Number);

    gasColumnsNumber.sort((a, b) => a - b);

    console.log(gasColumnsNumber)
    let median;
    let len = gasColumnsNumber.length;
    if (len % 2 === 0) { // If the length of the array is even
      let mid1 = gasColumnsNumber[(len / 2) - 1];
      let mid2 = gasColumnsNumber[len / 2];
      median = (mid1 + mid2) / 2;
    } else { // If the length of the array is odd
      median = gasColumnsNumber[(len - 1) / 2];
    }

    await browser.close()

    fetch(`/api/saveToDb`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          chainID: chainId,
          gasPrices: gasColumnsNumber,
          median: median
        }
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    return NextResponse.json({ gasPrices: gasColumnsNumber, median: median }, { status: 200 })

  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}