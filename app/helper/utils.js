import app from "@/firebase.config.js"
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, arrayUnion, query, orderBy, limit, getDocs } from "firebase/firestore";

const db = getFirestore(app)

// To add tests in test conllection
export async function addData(collection, id, data) {
    let result = null;
    let error = null;

    try {

        let ref = doc(db, collection, id);
        const dataWithTimestamp = { ...data, created_at: new Date() };
        result = await setDoc(ref, { data: arrayUnion(dataWithTimestamp) }, { merge: true });

    } catch (e) {
        console.log(e)
        error = e
    }
    return { result, error };
}

// To add tests  in login conllection
export async function updateData(collection, id, data) {
    let result = null;
    let error = null;
    try {
        let ref = doc(db, collection, id);
        result = await updateDoc(ref, {
            data:(data)
        });
    } catch (e) {
        error = e
    }
    return { result, error };
}

export async function getData(collection, key) {
    let result = null;
    let error = null;
    try {
        let ref = doc(db, collection, key);
        result = await getDoc(ref);
    } catch (error) {
        error
    }
    return { result, error }
}

export async function getLatestData(collectionName, id) {
    let result = null;
    let error = null;
    try {
        const ref = doc(db, collectionName, id);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
            const data = docSnap.data();
            // Assuming 'data' is an array of objects with 'created_at' field
            data.sort((a, b) => b.created_at - a.created_at);
            result = data[0]; // The latest data
        }
    } catch (e) {
        console.log(e)
        error = e
    }
    return { result, error };
}