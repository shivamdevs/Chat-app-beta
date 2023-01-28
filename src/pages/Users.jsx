import classNames from 'classnames';
import React, { createRef, useState } from 'react';
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
import { ContextMenu, ContextMenuItem, ContextMenuTrigger } from 'myoasis-contextmenu';
import { updateFriendConnect } from '../fb.chat';


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

    const [selection, setSelection] = useState(false);
    const [selectionList, setSelectionList] = useState([]);

    const updateSelection = ({ target }) => {
        setSelectionList(old => {
            const list = [];
            for (const key in userBondids) if (Object.hasOwnProperty.call(userBondids, key) && old.includes(userBondids[key])) list.push(userBondids[key]);
            const val = target.value;
            if (target.checked) {
                list.push(val);
            } else {
                list.splice(list.indexOf(val), 1);
            }
            return list;
        });
    };
    const resetSelection = (action) => {
        const list = [...selectionList];
        document.getElementsByName("userselection").forEach(item => item.checked && item.click());
        setSelection(false);
        if (action === "pin") {
            for (const binds of list) updateFriendConnect(binds, { pinned: true });
        } else if (action === "unpin") {
            for (const binds of list) updateFriendConnect(binds, { pinned: false });
        } else if (action === "clear") {
            // for (const binds of list) updateFriendConnect(binds, { pinned: true });
        } else if (action === "delete") {
            const obj = {};
            obj[user.uid] = null;
            for (const binds of list) updateFriendConnect(binds, obj);
        }
    };


    return (
        <>
            <Section>
                {!selection && <header className="header">
                    <div className={css.headblock}>
                        <img className={css.logo} src="/logo192.png" alt="" />
                    </div>
                    {chatHistory && <div className={css.headblock}>
                        <button className="crbutton" onClick={() => navigate("/search")}><i className="far fa-search"></i></button>
                        <ContextMenuTrigger menu="profile" className={css.user} exact={false} trigger="click"><img src={user.photoURL || "https://assets.myoasis.tech/accounts/user-no-image.svg"} alt="" /></ContextMenuTrigger>
                        <ContextMenu menu="profile" className="contextmenu">
                            <ContextMenuItem className="contextmenuitem" onClick={() => setSelection(true)}><i className="fas fa-ballot-check"></i><span>Select contacts</span></ContextMenuItem>
                            <ContextMenuItem className="contextmenuitem" onClick={() => navigate("/profile/" + user.uid)}><i className="fas fa-face-viewfinder"></i><span>View profile</span></ContextMenuItem>
                            <ContextMenuItem className="contextmenuitem" onClick={() => navigate("/accounts/profile")}><i className="fas fa-user-pen"></i><span>Edit profile</span></ContextMenuItem>
                            <ContextMenuItem className="contextmenuitem" onClick={() => logout()}><i className="fas fa-power-off"></i><span>Logout</span></ContextMenuItem>
                        </ContextMenu>
                    </div>}
                </header>}
                {selection && <header className="header">
                    <div className={css.slflow}>
                        <button className="crbutton" onClick={resetSelection}>
                            <i className="far fa-times"></i>
                        </button>
                        <span className={css.sltitle}>({selectionList.length} / {chatHistory.length})</span>
                    </div>
                    <div className={css.slflow}>
                        <button className="crbutton" onClick={() => resetSelection("pin")} disabled={(selectionList.length === 0)}>
                            <i className="fas fa-thumbtack"></i>
                        </button>
                        <button className="crbutton" onClick={() => resetSelection("unpin")} disabled={(selectionList.length === 0)}>
                            <i className="fas fa-link-slash"></i>
                        </button>
                        <button className="crbutton" onClick={() => resetSelection("clear")} disabled={(selectionList.length === 0)}>
                            <i className="fas fa-delete-left"></i>
                        </button>
                        <button className="crbutton" onClick={() => resetSelection("delete")} disabled={(selectionList.length === 0)}>
                            <i className="fas fa-user-slash"></i>
                        </button>
                    </div>
                </header>}
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
                        const check = createRef();
                        return (<div key={item.id} className={css.colrow}>
                            <ContextMenuTrigger menu={item.id} className={css.column} exact={false} onContextMenu={() => !selection}>
                                <input className={css.checker} type="checkbox" onChange={updateSelection} name="userselection" value={item.id} ref={check} />
                                <div className={css.uhData} onClick={() => (selection ? check.current.click() : navigate(`/${item.to}`))}>
                                    <div className={css.uhRow}>
                                        <div className={classNames('ellipsis', css.uhTopname, (item.vc ? "" : css.uhInvalid))}>{item.by?.name}</div>
                                        <div className={css.uhToptime}>{item.in && <i className="fas fa-thumbtack">&nbsp;&nbsp;&nbsp;</i>}{getDisplayDate(item.at)}</div>
                                    </div>
                                    <div className={css.uhRow}>
                                        <div className={classNames('ellipsis', css.uhMessage)}>{item.me && "You: "}{CryptoJS.AES.decrypt(item.on, item.en).toString(CryptoJS.enc.Utf8).slice(0, 80)}</div>
                                    </div>
                                </div>
                                <div className={css.uhPhoto} onClick={() => navigate(`/preview/${item.by.uid}`)}>
                                    <img
                                        alt=""
                                        src={item.by?.profile || "https://assets.myoasis.tech/accounts/user-no-image.svg"}
                                        className={css.waiting}
                                        onLoad={({ target }) => target.classList.remove(css.waiting)}
                                        onError={({ target }) => target.classList.add(css.waiting)}
                                    />
                                </div>
                            </ContextMenuTrigger>
                            <ContextMenu menu={item.id} className="contextmenu">
                                <ContextMenuItem className="contextmenuitem" onClick={(data) => navigate(`/profile/${data}`)} data={item.to}><i className="fas fa-fw fa-address-card"></i><span>View profile</span></ContextMenuItem>
                                <ContextMenuItem className="contextmenuitem" onClick={(data) => updateFriendConnect(data.id, {pinned: !data.in})} data={item}>
                                    {item.in && <><i className="fas fa-fw fa-link-slash"></i><span>Unpin contact</span></>}
                                    {!item.in && <><i className="fas fa-fw fa-thumbtack"></i><span>Pin contact</span></>}
                                </ContextMenuItem>
                                <ContextMenuItem className="contextmenuitem" onClick={(data) => navigate(`/deletechat/${data}`)} data={item.to}><i className="fas fa-fw fa-delete-left"></i><span>Delete all chats</span></ContextMenuItem>
                                <ContextMenuItem className="contextmenuitem" onClick={(data) => navigate(`/deleteuser/${data}`)} data={item.to}><i className="fas fa-fw fa-user-slash"></i><span>Delete contact</span></ContextMenuItem>
                            </ContextMenu>
                        </div>);
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
                <Route path='/preview/:userid' element={<Preview back={back} navigate={navigate} usersDetails={usersDetails} />} />
                <Route path='/profile/:userid' element={<Preview back={back} navigate={navigate} usersDetails={usersDetails} />} />
                <Route path='/search' element={<Search me={user} navigate={navigate} back={back} users={usersDetails} history={usersHistory} />} />
            </Routes>}
        </>
    );
}

export default Users;