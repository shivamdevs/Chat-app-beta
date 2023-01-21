import classNames from 'classnames';
import React from 'react';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import { setTitle } from '../app.functions';
import Section from '../layouts/Section';
import css from './styles/Preview.module.css';

function Preview({ back = null }) {
    const location = useLocation();
    const username = decodeURI(location.hash.slice(1));
    setTitle(username || 'Preview contents');
    return (
        <Section>
            <header className="header">
                <button className="crbutton" onClick={back}>
                    <i className="far fa-arrow-left"></i>
                </button>
                <div className={classNames("ellipsis", css.title)}>{username}</div>
            </header>
            <main className={classNames("mainbody", css.content)}>
                <Routes>
                    {/* <Route path="/image/:source" element={<PreviewImage />} /> */}
                    <Route path="/:source" element={<PreviewImage />} />
                </Routes>
            </main>
        </Section>
    )
}

export default Preview;

function PreviewImage() {
    const params = useParams();
    return (
        <img
            className={classNames(css.image, css.target, css.waiting)}
            src={params.source}
            alt=""
            onLoad={({ target }) => { target.classList.remove(css.waiting); target.classList.remove(css.broken); }}
            onError={({ target }) => { target.classList.remove(css.waiting); target.classList.add(css.broken); }}
        />
    );
}