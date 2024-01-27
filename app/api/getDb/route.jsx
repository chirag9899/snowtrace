import { NextResponse } from "next/server";
import { addData, updateData, getData } from '@/app/helper/utils'


export const POST = async (request, { params }) => {
    try {
        const { data } = await request.json();
        const { chainID } = data;
        const info = await getData("Tacker", chainID)
        const sortedData = info.result.data().data.sort((a, b) => b.created_at.seconds - a.created_at.seconds);
        const mostRecentData = sortedData[0];
        console.log(mostRecentData)
        return NextResponse.json({ data: { ...mostRecentData, chainID } }, { status: 200 })

    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "unable to get data" }, { status: 500 });
    }
}
