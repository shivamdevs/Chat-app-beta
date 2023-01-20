import { onSnapshot } from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";
import app from "./app.data";
import { db } from "./fb.user";

const table = {
    connect:"chat-connects",
    message: "chat-messages",
};

function snapHistory(user, resolve, reject) {
    const q = query(collection(db, table.connect), where(user.uid, "==", user.uid));
    const snap = onSnapshot(q, resolve, reject);
    return snap;
}

// function snapChats(bind, resolve, reject) {
//     const q = query(collection(db, table.message), where("connect", "==", bind));
//     const snap = onSnapshot(q, resolve, reject);
//     return snap;
// }

function snapUsers(resolve, reject) {
    const snap = onSnapshot(collection(db, "users"), resolve, reject);
    return snap;
}

let querysnap = null;
// let querychatsnap = null;
let currentbond = undefined;

export default function snapShot(user, resolve, reject) {
    if (!querysnap) {
        querysnap = {
            history: {
                event: snapHistory(user, snap => {
                    if (querysnap.history.values === null || snap.docChanges().length) {
                        querysnap.history.values = {
                            current: [],
                            contact: [],
                            bondid: {},
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
                                querysnap.history.values.bondid[to] = shots.id;
                                querysnap.history.values.contact.push(to);
                                querysnap.history.values.current.push(push);
                            });
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

export function setCurrentBond(bond) {
    console.log(currentbond);
    currentbond = bond;
    console.log(currentbond);
}

// export function snapMessageChannel(resolve, reject) {
//     if (!querychatsnap) {
//         //querychatsnap = snapUsers();
//     }
// }



let bufferMessages = {};

if (window.localStorage) {
    let buffer = window.localStorage.getItem(`${app.bucket}:buffer:messages`);
    if (buffer !== null) {
        try {
            buffer = JSON.parse(buffer);
            bufferMessages = buffer;
        } catch (error) {}
    }
}

export function setBufferMesage(key, value) {
    if (value) {
        bufferMessages[key] = value;
    } else {
        delete bufferMessages[key];
    }
    if (window.localStorage) window.localStorage.setItem(`${app.bucket}:buffer:messages`, JSON.stringify(bufferMessages));
}
export function getBufferMesage(key) {
    return bufferMessages[key];
}