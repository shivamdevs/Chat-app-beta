import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import reactStringReplace from 'react-string-replace';
import { setTitle } from '../app.functions';
import Section from '../layouts/Section';
import css from './styles/Search.module.css';

function Search({ back = null, navigate = null, users = [], history = [], me = null }) {
    setTitle("Search users");
    const [search, setSearch] = useState("");
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (!search) {
            setResult(null);
        } else {
            const loop = [];
            for (const key in users) {
                if (Object.hasOwnProperty.call(users, key)) {
                    const user = users[key];
                    if ((user.name.toLowerCase().includes(search.toLowerCase()) || user.uid === search) && (user.admin || !user.hidden)) loop.push(user);
                }
            }
            setResult(loop);
        }
    }, [me.admin, me.uid, search, users]);

    return (
        <Section>
            <header className={classNames("header", css.header)}>
                <div className={css.headtop}>
                    <button className="crbutton" onClick={back}>
                        <i className="far fa-arrow-left"></i>
                    </button>
                </div>
                <div className={css.headtop}>
                    <span className={css.proxy}><i className="fas fa-search"></i></span>
                    <input
                        type="search"
                        className={css.search}
                        autoFocus={true}
                        placeholder="Search..."
                        onChange={({ target }) => setSearch(target.value.trim())}
                    />
                </div>
            </header>
            <main className="mainbody">
                {result === null && <>
                    <div className={css.nullhead}>Start typing</div>
                    <div className={css.nullload}>Type something to search for users.</div>
                </>}
                {result?.length === 0 && <>
                    <div className={css.nullhead}>No match found</div>
                    <div className={css.nullload}>No user matched with the search query.</div>
                </>}
                {result?.length > 0 && <>
                    <div className={css.nullhead}>Search results</div>
                    {result.map(user => <div key={user.uid} className={css.usrow} onClick={() => navigate(`/${user.uid}`, true)}>
                        <div className={css.usphoto}>
                            <img
                                alt=""
                                className={css.waiting}
                                onError={({ target }) => target.classList.add(css.waiting)}
                                onLoad={({ target }) => target.classList.remove(css.waiting)}
                                src={user.profile || "https://assets.myoasis.tech/accounts/user-no-image.svg"}
                            />
                        </div>
                        <div className={classNames(css.usname, "ellipsis")}>{reactStringReplace(user.name, search, (match, i) => <span key={i}>{match}</span>)}</div>
                        {(me?.uid !== user.uid) && !history?.includes(user.uid) && <div className={css.usdot}>New</div>}
                        {(me?.uid === user.uid) && <div className={css.usdot}>You</div>}
                    </div>)}
                    <div className={css.nullload}>{result.length} user{result.length > 1 ? "s" : ""} matched with the search query.</div>
                </>}
            </main>
        </Section>
    );
}

export default Search;