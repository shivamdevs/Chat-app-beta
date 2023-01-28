import classNames from 'classnames';
import React from 'react';
import PrismaZoom from 'react-prismazoom';
import { useParams } from 'react-router-dom';
import { setTitle } from '../app.functions';
import Invalid from '../layouts/Invalid';
import Section from '../layouts/Section';
import css from './styles/Preview.module.css';

function Preview({
    back = null,
    navigate = null,
    usersDetails = null,
}) {
    const params = useParams();
    const user = usersDetails[params.userid];
    setTitle(user?.name || 'Preview contents');
    return (
        <Section>
            <header className="header">
                <button className="crbutton" onClick={back}>
                    <i className="far fa-arrow-left"></i>
                </button>
                <div className={classNames("ellipsis", css.title)}>{user?.name}</div>
                {user?.uid?.length > 0 && <button className="crbutton" onClick={() => navigate(`/profile/${user.uid}`)}>
                    <i className="fas fa-face-viewfinder"></i>
                </button>}
            </header>
            <main className={classNames("mainbody", css.content)}>
                <PrismaZoom className={css.zoomer}>
                    <img
                        className={classNames(css.image, css.target, css.waiting)}
                        src={user?.profile}
                        alt=""
                        onLoad={({ target }) => { target.classList.remove(css.waiting); target.classList.remove(css.broken); }}
                        onError={({ target }) => { target.classList.remove(css.waiting); target.classList.add(css.broken); }}
                    />
                </PrismaZoom>
            </main>
            {!user && <Invalid back={back} />}
        </Section>
    )
}

export default Preview;