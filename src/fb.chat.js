import { addDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";
import app from "./app.data";
import { db } from "./fb.user";
import uniqid from 'uniqid';
import CryptoJS from "crypto-js";


const table = {
    connect: "chat-connects",
    message: "chat-messages",
};

function snapHistory(user, resolve, reject) {
    const q = query(collection(db, table.connect), where(user.uid, "==", user.uid));
    const snap = onSnapshot(q, resolve, reject);
    return snap;
}

function snapUsers(resolve, reject) {
    const snap = onSnapshot(collection(db, "users"), resolve, reject);
    return snap;
}

let querysnap = null;

export default function snapShot(user, resolve, reject) {
    if (!querysnap) {
        querysnap = {
            history: {
                event: snapHistory(user, snap => {
                    if (querysnap.history.values === null || snap.docChanges().length) {
                        querysnap.history.values = snap.docs.sort((a, b) => a.data().updated - b.data().updated).reverse();
                        callback();
                    }
                }, reject),
                values: null,
            },
            users: {
                event: snapUsers(snap => {
                    if (querysnap.users.values === null || snap.docChanges().length) {
                        querysnap.users.values = snap.docs;
                        callback();
                    }
                }, reject),
                values: null,
            },
        };
    }
    function callback() {
        const result = {
            bondid: {},
            current: [],
            contact: [],
            users: {},
        };
        if (querysnap.history.values) {
            querysnap.history.values.forEach(shots => {
                const data = shots.data();
                const to = (() => {
                    if (user.uid === data.users[0]) return data.users[1];
                    if (user.uid === data.users[1]) return data.users[0];
                })();
                const sender = (() => {
                    if (!querysnap.users.values) return;
                    const ops = querysnap.users.values[to];
                    return ops;
                })();
                const push = {
                    id: shots.id,
                    to: to,
                    by: sender,
                    me: (to !== data.sender),
                    at: data.updated,
                    on: data.content,
                    en: data.encrypt,
                };
                result.bondid[to] = shots.id;
                result.contact.push(to);
                result.current.push(push);
            });
        } else {
            result.bondid = null;
            result.current = null;
            result.contact = null;
        }
        if (querysnap.users.values) {
            querysnap.users.values.forEach((users) => {
                const data = users.data();
                result.users[data.uid] = data;
            });
        } else {
            result.users = null;
        }
        resolve(result);
    }
    callback();
}


function snapChats(bind, resolve, reject) {
    const q = query(collection(db, table.message), where("connect", "==", bind));
    const snap = onSnapshot(q, resolve, reject);
    return snap;
}
let querychatsnap = null;

export function snapMessageChannel(bond, resolve, reject) {
    if (!querychatsnap) {
        querychatsnap = {
            event: snapChats(bond, (snap) => {
                if (querychatsnap.values === null || snap.docChanges().length) {
                    querychatsnap.values = [];
                    if (!snap.empty) {
                        snap.docs.forEach((chats) => {
                            const data = chats.data();
                            querychatsnap.values.push({ ...data, id: chats.id });
                        });
                    }
                    callback();
                }
            }, reject),
            values: null,
        };
    }
    function callback() {
        resolve(querychatsnap.values);
    }
    callback();
}
export function unsnapMessageChannel() {
    querychatsnap?.event();
    querychatsnap = null;
}



let bufferMessages = {};

if (window.localStorage) {
    let buffer = window.localStorage.getItem(`${app.bucket}:buffer:messages`);
    if (buffer !== null) {
        try {
            buffer = JSON.parse(buffer);
            bufferMessages = buffer;
        } catch (error) { }
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

export async function sendMessage(message, connect, user, friend, before, reject) {
    const date = (() => {
        const d = new Date();
        return {
            now: d.getTime(),
            date: new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(),
            print: `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() < 12 ? "am" : "pm"}`,
        };
    })();
    const me = { ...user };
    const bond = { ...friend };
    const encrypt = uniqid();
    const post = {
        sent: date.print,
        groupby: date.date,
        sortby: date.now,
        content: CryptoJS.AES.encrypt(message, encrypt).toString(),
        sender: user.uid,
        connect: connect,
        encrypt: encrypt,
    };
    before(post);
    try {
        if (!post.connect) {
            const addbond = {
                users: [
                    me.uid,
                    bond.uid,
                ],
                created: date.now,
                updated: date.now,
                content: post.content,
                sender: user.uid,
                encrypt: encrypt,
            };
            addbond[me.uid] = me.uid;
            addbond[bond.uid] = bond.uid;
            const getkey = await addDoc(collection(db, table.connect), addbond);
            post.connect = getkey.id;
        }
        const updates = {
            content: post.content,
            updated: date.now,
            sender: user.uid,
            encrypt: encrypt,
        }
        await updateDoc(doc(db, table.connect, post.connect), updates);
        await addDoc(collection(db, table.message), post);
    } catch (error) {
        console.error(error);
        reject(error);
    }
}