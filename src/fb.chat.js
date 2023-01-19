import { onSnapshot } from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";
import { db } from "./fb.user";

const table = "chat-chats";

function snapHistory(user, resolve, reject) {
    const q = query(collection(db, table), where(user.uid, "==", user.uid));
    const snap = onSnapshot(q, resolve, reject);
    return snap;
};

function snapUsers(resolve, reject) {
    const snap = onSnapshot(collection(db, "users"), resolve, reject);
    return snap;
}

let querysnap = null;

export default function snapShot(user, bond, resolve, reject) {
    if (!querysnap) {
        querysnap = {
            history: {
                event: snapHistory(user, snap => {
                    if (querysnap.history.values === null || snap.docChanges().length) {
                        querysnap.history.values = {
                            current: [],
                            contact: [],
                        };
                        if (!snap.empty) {
                            snap.docs.sort((a, b) => a.data().updated - b.data().updated).reverse().forEach(shots => {
                                const data = shots.data();
                                const to = (() => {
                                    if (user.uid === data.users[0]) return data.users[1];
                                    if (user.uid === data.users[1]) return data.users[0];
                                })();
                                const sender = querysnap.users.values[to];
                                const push = {
                                    id: shots.id,
                                    to,
                                    by: sender?.name,
                                    as: sender?.profile,
                                    at: data.updated,
                                };
                                querysnap.history.values.contact.push(to);
                                querysnap.history.current.push(push);
                            });
                            querysnap.history.values = snap.docs;
                        }
                        callback();
                    }
                }, reject),
                values: null,
            },
            users: {
                event: snapUsers(snap => {
                    if (querysnap.users.values === null || snap.docChanges().length) {
                        querysnap.users.values = {};
                        if (!snap.empty) {
                            snap.docs.forEach((users) => {
                                const data = users.data();
                                querysnap.users.values[users.id] = { ...data, id: users.id };
                            });
                        }
                        callback();
                    }
                }, reject),
                values: null,
            },
        };
    }
    function callback() {
        resolve({
            history: querysnap.history.values,
            users: querysnap.users.values,
        });
    }
    callback();
}