import classNames from 'classnames';
import React, { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { getBufferMesage, setBufferMesage } from '../fb.chat';
import css from './styles/Chats.module.css';

function Chats({
    friend = null,
}) {
    const [message, setMessage] = useState(getBufferMesage(friend.id) || "");
    // const [tempMessage, setTempMessages] = [];
    const textbox = useRef();

    const sendMessage = () => {
        const postmessage = message;
        setMessage("");
        textbox.current && (textbox.current.value = "");
        console.log(postmessage);
    };

    useEffect(() => {
        setBufferMesage(friend.id, message);
        if (textbox.current) {
            textbox.current.style.height = 0;
            textbox.current.style.height = (textbox.current.scrollHeight) + "px";
        }
    }, [friend.id, message]);

    useEffect(() => {

    }, []);
    return (
        <>
            <main className="mainbody">

            </main>
            <footer className={css.messenger}>
                <div className={css.message}>
                    <textarea
                        ref={textbox}
                        className={css.textbox}
                        defaultValue={message}
                        placeholder="Enter your message..."
                        onChange={({ target }) => setMessage(target.value)}
                        onBlur={({ target }) => target.focus()}
                        autoFocus={true}
                    ></textarea>
                    <button className={classNames("crbutton", css.send)} onClick={sendMessage} disabled={message.trim().length === 0 || message.length > 250}>
                        <i className="far fa-paper-plane"></i>
                    </button>
                </div>
                {message.length > 250 && <div className={css.error}>Message is too long. Please cut is short.</div>}
            </footer>
        </>
    );
};

export default Chats;