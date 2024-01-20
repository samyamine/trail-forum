import {collection, getDocs, query, where} from "@firebase/firestore";
import {db} from "@/lib/firebase/config";

function isUndefined(element: any): boolean {
    return typeof element === "undefined";
}

const isUsernameAvailable = async (username: string): Promise<boolean> => {
    const usersRef = collection(db, "users");
    const usernameQuery = query(usersRef, where("username", "==", username));

    const querySnapshot = await getDocs(usernameQuery);
    return querySnapshot.empty;
};

export {
    isUsernameAvailable,
    isUndefined,
}
