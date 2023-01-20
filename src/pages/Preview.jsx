import classNames from 'classnames';
import React from 'react';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import { setTitle } from '../app.functions';
import css from './styles/Preview.module.css';

function Preview({ back = null }) {
    const location = useLocation();
    setTitle('Preview contents');
    return (
        <section className="section">
            <header className="header">
                <button className="crbutton" onClick={back}>
                    <i className="far fa-arrow-left"></i>
                </button>
                {location.hash.length > 0 && <div className={classNames("ellipsis", css.title)}>{decodeURI(location.hash.slice(1))}</div>}
            </header>
            <main className={classNames("mainbody", css.content)}>
                <Routes>
                    {/* <Route path="/image/:source" element={<PreviewImage />} /> */}
                    <Route path="/:source" element={<PreviewImage />} />
                </Routes>
            </main>
        </section>
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