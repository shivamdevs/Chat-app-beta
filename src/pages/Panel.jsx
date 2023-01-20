import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { setTitle } from '../app.functions';
import Chats from '../layouts/Chats';
import css from './styles/Panel.module.css';

function Panel({
    back = null,
    friend = null,
    navigate = null,
    setFriend = null,
    usersDetails = null,
}) {
    setTitle(friend?.name);
    const params = useParams();
    const [buffer, setBuffer] = useState(false);
    useEffect(() => {
        if (!params || !params.bondid || !usersDetails) {
            setFriend(null);
        } else {
            const bind = usersDetails[params.bondid];
            if (bind) { setFriend(bind); setBuffer(true); } else { setFriend(null); setBuffer(false); }
        }
        return () => {setFriend(null)};
    }, [back, friend, params, setFriend, usersDetails]);
    return (
        <>
            {buffer && <section className="section">
                <header className="header">
                    <button className="crbutton" onClick={back}>
                        <i className="far fa-arrow-left"></i>
                    </button>
                    <div className={css.user} onClick={() => navigate(`/profile/${friend.id}`)}>
                        <div className={css.photo}>
                            <img
                                alt=""
                                className={css.waiting}
                                onError={({ target }) => target.classList.add(css.waiting)}
                                onLoad={({ target }) => target.classList.remove(css.waiting)}
                                src={friend.profile || "https://assets.myoasis.tech/accounts/user-no-image.svg"}
                            />
                        </div>
                        <div className={classNames(css.name, "ellipsis")}>{friend.name}</div>
                    </div>
                </header>
                <Chats friend={friend} />
            </section>}
            {!buffer && <section className="section transparent">
                <main className="mainbody">
                    <div className="tstitle">Invalid token</div>
                    <div className="tsbody">This URL is invalid or has expired.</div>
                    <div className="tsoptions">
                        <button className="tsbutton" type="button" onClick={back}>Go back</button>
                    </div>
                </main>
            </section>}
        </>
    );
}

export default Panel;