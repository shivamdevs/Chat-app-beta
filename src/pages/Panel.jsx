import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Ripple } from '../app.functions';
import css from './styles/Panel.module.css';

function Panel({
    back = null,
    setBond = null,
    setParams = null,
    usersDetails = null,
}) {
    const params = useParams();
    useEffect(() => {
        if (!params || !params.bondid || !usersDetails) return setBond(null);
        const bind = usersDetails[params.bondid];
        if (bind) setBond(bind); else { setBond(null); back(); }
    }, [back, params, setBond, setParams, usersDetails]);
    return (
        <section className="section">
            <header className="header">
                <Ripple>
                    <button className="crbutton" onClick={back}>
                        <i className="far fa-arrow-left"></i>
                    </button>
                </Ripple>
                <div className={css.bdphoto}></div>
            </header>
            <main className="mainbody">

            </main>
        </section>
    );
}

export default Panel;