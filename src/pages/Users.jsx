import classNames from 'classnames';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { logout } from '../fb.user';
import { LoadSVG } from '../layouts/Loading';
import css from './styles/Users.module.css';
import { getDisplayDate, setTitle } from '../app.functions';
import Panel from './Panel';
import Preview from './Preview';
import Search from './Search';
import Section from '../layouts/Section';
import CryptoJS from "crypto-js";


function Users({
    user = {},
    back = null,
    loading = true,
    navigate = null,
    chatHistory = null,
    userBondids = null,
    usersDetails = null,
    usersHistory = null,
}) {
    setTitle(chatHistory ? "Home" : "Loading");

    return (
        <>
            <Section>
                <header className="header">
                    <div className={css.headblock}>
                        <img className={css.logo} src="/logo192.png" alt="" />
                    </div>
                    <div className={css.headblock}>
                        <button className="crbutton" onClick={() => chatHistory && navigate("/search")}><i className="far fa-search"></i></button>
                        <button className={css.user} onClick={() => chatHistory && logout(true)}><img src={user.photoURL || "https://assets.myoasis.tech/accounts/user-no-image.svg"} alt="" /></button>
                    </div>
                </header>
                <main className={classNames("mainbody", css.container)}>
                    {!chatHistory && <div className={css.nullload}>
                        <LoadSVG />
                        <span>Getting your previous chats...</span>
                    </div>}
                    {chatHistory?.length === 0 && <div className={css.nullload}>
                        <span>You don't have any chat history yet!</span>
                        <span>Start a new chat now.</span>
                    </div>}
                    {chatHistory?.length > 0 && chatHistory.map(item => {
                        item.by = item.by || usersDetails[item.to];
                        return (
                            <div key={`${item.id}`} className={css.column}>
                                <div className={css.uhData} onClick={() => navigate(`/${item.to}`)}>
                                    <div className={css.uhRow}>
                                        <div className={classNames('ellipsis', css.uhTopname)}>{item.by.name}</div>
                                        <div className={css.uhToptime}>{getDisplayDate(item.at)}</div>
                                    </div>
                                    <div className={css.uhRow}>
                                        <div className={classNames('ellipsis', css.uhMessage)}>{item.me && "You: "}{CryptoJS.AES.decrypt(item.on, item.en).toString(CryptoJS.enc.Utf8)}</div>
                                    </div>
                                </div>
                                <div className={css.uhPhoto} onClick={() => navigate(`/preview/${encodeURIComponent(item.by.profile)}#${encodeURI(item.by.name)}`)}>
                                    <img
                                        alt=""
                                        src={item.by.profile || "https://assets.myoasis.tech/accounts/user-no-image.svg"}
                                        className={css.waiting}
                                        onLoad={({ target }) => target.classList.remove(css.waiting)}
                                        onError={({ target }) => target.classList.add(css.waiting)}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    {chatHistory && <footer className={css.footer}>
                        <button className={classNames("crbutton", css.addnew)} onClick={() => navigate("/search")}>
                            <i className="fas fa-message-lines"></i>
                        </button>
                    </footer>}
                </main>
            </Section>
            {!loading && <Routes>
                <Route path="/:bondid/*" element={<Panel back={back} navigate={navigate} user={user} userBondids={userBondids} usersDetails={usersDetails} />} />
                <Route path='/preview/*' element={<Preview back={back} />} />
                <Route path='/search' element={<Search me={user} navigate={navigate} back={back} users={usersDetails} history={usersHistory} />} />
            </Routes>}
        </>
    );
}

export default Users;