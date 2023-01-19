import { doc, onSnapshot } from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";
import { db } from "./fb.user";

const table = "chat-chats";

export function startSnapShot(user, resolve, reject) {
    const q = query(collection(db, table), where(user.uid, "==", user.uid));
    const snap = onSnapshot(q, resolve, reject);
    return snap;
};

export function startUserShot(resolve, reject) {
    const snap = onSnapshot(collection(db, "users"), resolve, reject);
    return snap;
}