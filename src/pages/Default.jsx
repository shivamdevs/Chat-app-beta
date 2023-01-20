import classNames from 'classnames';
import React from 'react';
import { MobileView } from 'react-device-detect';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Route, Routes, useNavigate } from 'react-router-dom';
import app from '../app.data';
import { setTitle } from '../app.functions';
import { auth } from '../fb.user';
import Handle from '../layouts/Handle';
import css from './styles/Default.module.css';

function Default() {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    if (!user) { setTitle("Welcome"); }
    return (
        <>
            {!user && <MobileView className={css.mvParent}>
                <div className={css.mbHeader}>
                    <img className={css.mbIcon} src="/logo192.png" alt="" />
                    <span className={css.mbText}>MeChat</span>
                </div>
                <lottie-player src="https://assets.myoasis.tech/chat/green_blue_char_02020.json" background="transparent" speed=".8" style={{ maxWidth: "400px", width: "100%", margin: "auto" }} loop autoplay></lottie-player>
                <div className={css.mbFooter}>
                    <button className={classNames('opbutton blue', css.mbButton)} onClick={() => navigate('/accounts')}>Continue to {app.name}</button>
                    <div className={css.mbBottom}>By continuing to this website you agree to our <a href={app.pathname + "/legal"} target="_blank" rel="noopener noreferrer">Privacy policy</a> and <a href={app.pathname + "/legal/terms"} target="_blank" rel="noopener noreferrer">Terms of Usage</a>.</div>
                    <div className={css.mbVersion}>Version: {app.version}</div>
                </div>
            </MobileView>}
            {user && <Routes>
                <Route path="/*" element={<Handle user={user} />} />
            </Routes>}
        </>
    )
}

export default Default;