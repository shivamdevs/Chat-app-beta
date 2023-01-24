import classNames from 'classnames';
import React, { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getBufferMesage, sendMessage, setBufferMesage } from '../fb.chat';
import { LoadSVG } from './Loading';
import css from './styles/Chats.module.css';
import uniqid from 'uniqid';
import CryptoJS from "crypto-js";
import { getDisplayDate } from '../app.functions';

function Chats({
    user = null,
    bond = null,
    friend = null,
    navigate = null,
    messageList = null,
    setMessageList = null,
}) {
    const [message, setMessage] = useState(getBufferMesage(friend.uid) || "");
    const [showscroller, setScroller] = useState(false);
    const [pendings, setPendings] = useState(0);
    const textbox = useRef();
    const chatbox = useRef();

    const sendData = () => {
        const postmessage = message.trim();
        setMessage("");
        textbox.current && (textbox.current.value = "");
        textbox.current && textbox.current.focus();
        if (showscroller) scrollerAdapt();

        sendMessage(postmessage, bond, user, friend, (snap) => {
            const parent = (() => {
                const d = new Date();
                return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
            })();
            const slip = {...snap};
            slip.pending = true;
            slip.id = uniqid();
            setMessageList(old => {
                const list = {...old};
                if (!list[parent]) list[parent] = [];
                list[parent].push(slip);
                return list;
            });
        }, (error) => {
            toast.error("Failed to send message.");
        });
    };

    const scrollerAdapt = (smooth = false) => {
        if (chatbox.current) {
            chatbox.current.scrollTo({ behavior: (smooth ? "smooth" : "auto"), top: "0"});
        }
    };

    useEffect(() => {
        if (!showscroller) setPendings(0);
    }, [showscroller, pendings]);
    useEffect(() => {
        setPendings(old => ++old);
    }, [messageList]);

    useEffect(() => {
        setBufferMesage(friend.uid, message);
        if (textbox.current) {
            textbox.current.style.height = 0;
            textbox.current.style.height = (textbox.current.scrollHeight) + "px";
        }
    }, [friend, message]);

    return (
        <>
            {!messageList && <main className="mainbody">
                <div className={css.nullload}>
                    <LoadSVG />
                    <span>Loading your chats with {friend?.name}</span>
                </div>
            </main>}
            {messageList && <main ref={chatbox} className={classNames("mainbody", css.chatbox)} onScroll={({target}) => setScroller(target.scrollTop < -30)}>
                <div className={css.chatflow}>
                    {Object.keys(messageList).length === 0 && <div className={css.nullload}>Start your conversation with {friend.name}.</div>}
                    {Object.keys(messageList).map(dates => <Dateblock navigate={navigate} key={dates} user={user} friend={friend} date={dates} chats={messageList[dates]} />)}
                </div>
            </main>}
            <footer className={css.messenger}>
                {showscroller && <button className={classNames(css.tobottom, "crbutton")} onClick={scrollerAdapt}>
                    <i className="fas fa-chevron-down"></i>
                    {pendings > 0 && <span className={css.pendings}>{pendings}</span>}
                </button>}
                <div className={css.message}>
                    <textarea
                        ref={textbox}
                        className={css.textbox}
                        autoFocus={true}
                        defaultValue={message}
                        placeholder="Enter your message..."
                        // onBlur={({ target }) => target.focus()}
                        onChange={({ target }) => setMessage(target.value)}
                    ></textarea>
                    <button className={classNames("crbutton", css.send)} onClick={sendData} disabled={message.trim().length === 0 || message.length > 250}>
                        <i className="far fa-paper-plane"></i>
                    </button>
                </div>
                {message.length > 250 && <div className={css.error}>Message is too long. Please cut is short.</div>}
            </footer>
        </>
    );
};

export default Chats;

function Dateblock({
    date = null,
    user = null,
    chats = null,
    friend = null,
    navigate = null,
}) {
    return (
        <div className={css.chatdates}>
            <div className={css.dateblock}>
                <div className={css.dateitem}>{getDisplayDate(+date, true)}</div>
            </div>
            {chats.map(chat => <Message user={user} navigate={navigate} key={chat.id} friend={friend} chat={chat} />)}
        </div>
    );
}

function Message({
    chat = null,
    user = null,
    friend = null,
    navigate = null,
}) {
    const block = useRef();
    return (
        <div className={classNames(css.chatblock, (chat.sender === user.uid ? css.current : css.friend))} ref={block}>
            <div className={css.photo} onClick={() => navigate(`./profile/${chat.sender}`)}>
                <img
                    alt=""
                    className={css.waiting}
                    onError={({ target }) => target.classList.add(css.waiting)}
                    onLoad={({ target }) => target.classList.remove(css.waiting)}
                    src={((chat.sender === user.uid) ? user.photoURL : friend.profile) || "https://assets.myoasis.tech/accounts/user-no-image.svg"}
                />
            </div>
            {chat.pending && <span className={css.sending}><LoadSVG width={12} /></span>}
            <div className={css.chatarea}>
                <div className={css.messagebox}>{CryptoJS.AES.decrypt(chat.content, chat.encrypt).toString(CryptoJS.enc.Utf8)}</div>
                <div className={css.timebox}>{chat.sent}</div>
            </div>
        </div>
    );
}