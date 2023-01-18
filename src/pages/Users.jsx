import React from 'react';
import { LoadSVG } from '../layouts/Loading';
import css from './styles/Users.module.css';

function Users({user = {}}) {
    return (
        <div className={css.wrap}>
            <div className={css.header}>
                <div className={css.headblock}>
                    <img className={css.logo} src="/logo192.png" alt="" />
                </div>
                <div className={css.headblock}>
                    <button className="crbutton"><i className="far fa-search"></i></button>
                    <button className={css.user}><img src={user.photoURL || "https://assets.myoasis.tech/accounts/user-no-image.svg"} alt="" /></button>
                </div>
            </div>
            <div className={css.nullload}>
                <LoadSVG />
                <span>Getting your previous chats...</span>
            </div>
        </div>
    )
}

export default Users;