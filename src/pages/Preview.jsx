import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { setTitle } from '../app.functions';
import Section from '../layouts/Section';
import css from './styles/Preview.module.css';

function Preview({
    back = null,
    usersDetails = null,
}) {
    const [user, setUser] = useState({});
    setTitle(user.name || 'Preview contents');
    return (
        <Section>
            <header className="header">
                <button className="crbutton" onClick={back}>
                    <i className="far fa-arrow-left"></i>
                </button>
                <div className={classNames("ellipsis", css.title)}>{user.name}</div>
            </header>
            <main className={classNames("mainbody", css.content)}>
                <Routes>
                    {/* <Route path="/image/:source" element={<PreviewImage />} /> */}
                    <Route path="/:userid" element={<PreviewImage setUser={setUser} usersDetails={usersDetails} />} />
                </Routes>
            </main>
        </Section>
    )
}

export default Preview;

function PreviewImage({usersDetails = null, setUser = null}) {
    const params = useParams();
    const user = usersDetails[params.userid];
    useEffect(() => {
        setUser(user);
    }, [setUser, user]);
    return (
        <img
            className={classNames(css.image, css.target, css.waiting)}
            src={user.profile}
            alt=""
            onLoad={({ target }) => { target.classList.remove(css.waiting); target.classList.remove(css.broken); }}
            onError={({ target }) => { target.classList.remove(css.waiting); target.classList.add(css.broken); }}
        />
    );
}