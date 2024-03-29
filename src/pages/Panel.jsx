import classNames from 'classnames';
import groupBy from 'group-by';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Route, Routes, useParams } from 'react-router-dom';
import sortBy from 'sort-by';
import { setTitle } from '../app.functions';
import { createFriendBond, snapMessageChannel, unsnapMessageChannel } from '../fb.chat';
import Chats from '../layouts/Chats';
import Invalid from '../layouts/Invalid';
import Section from '../layouts/Section';
import Preview from './Preview';
import css from './styles/Panel.module.css';

function Panel({
    back = null,
    user = null,
    navigate = null,
    userBondids = null,
    usersDetails = null,
}) {
    const [messages, setMessages] = useState(null);
    const [friend, setFriend] = useState(null);
    const [buffer, setBuffer] = useState(null);
    const [bond, setBond] = useState(false);
    setTitle(friend?.name || "Loading");
    const params = useParams();

    useEffect(() => {
        if (params?.bondid && usersDetails) {
            const bind = usersDetails[params.bondid];
            if (bind) {
                const ukey = userBondids[bind.uid];
                if (ukey) {
                    setFriend(bind);
                    setBuffer(true);
                    setTitle(bind.name);
                    setBond(userBondids[bind.uid]);
                } else {
                    const bonds = createFriendBond(user, bind);
                    if (!bonds.id) toast.error("Failed to create a friend id.");
                }
            } else { setBuffer(false); setTitle("Invalid token") }
        }
    }, [friend, params, setBond, setFriend, user, userBondids, usersDetails]);

    useEffect(() => {
        bond && snapMessageChannel(bond, (snap) => {
            if (!snap) return setMessages(null);
            const msg = snap;
            msg.sort(sortBy("sortby", "groupby"));
            setMessages(groupBy(msg, "groupby"));
        }, (error) => {
            toast.error("Error getting your chats.");
        });
        return () => unsnapMessageChannel();
    }, [bond]);

    return (
        <>
            {buffer === true && <Section>
                <header className="header">
                    <button className="crbutton" onClick={back}>
                        <i className="far fa-arrow-left"></i>
                    </button>
                    <div className={css.user} onClick={() => navigate(`/${friend.uid}/profile/${friend.uid}`)}>
                        <div className={css.photo}>
                            <img
                                alt=""
                                className={css.waiting}
                                onError={({ target }) => target.classList.add(css.waiting)}
                                onLoad={({ target }) => target.classList.remove(css.waiting)}
                                src={friend.profile || "https://assets.myoasis.tech/accounts/user-no-image.svg"}
                            />
                        </div>
                        <div className={classNames(css.name, "ellipsis")}>{friend?.name}</div>
                    </div>
                </header>
                <Chats friend={friend} bond={bond} navigate={navigate} messageList={messages} setMessageList={setMessages} user={user} />
                <Routes>
                    <Route path='/preview/*' element={<Preview back={back} />} />
                </Routes>
            </Section>}
            {buffer === false && <Invalid back={back} />}
        </>
    );
}

export default Panel;