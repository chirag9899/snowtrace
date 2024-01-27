import { NextResponse } from "next/server";
import { addData, updateData, getData } from '@/app/helper/utils'
import { FieldValue, serverTimestamp  } from "firebase/firestore";


export const POST = async (request, { params }) => {
    try {
        const { data } = await request.json();
        console.log("datahaiii",data)
        const { chainID, gasPrices, median } = data;
        const finalData = { gasPrices, median };
        await addData("Tacker", chainID, finalData)

        return NextResponse.json({ data: "data saved success" }, { status: 200 })

    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "unable to save data in db" }, { status: 500 });
    }
}

