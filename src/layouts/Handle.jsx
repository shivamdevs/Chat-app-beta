import React, { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import snapShot, { setCurrentBond } from '../fb.chat';
import Users from '../pages/Users';

function Handle({ user = null }) {
    const navigate = useNavigate();
    const location = useLocation();

    const navigateTo = useCallback((to, replace = false) => {
        setTimeout(() => {
            navigate(to, { replace });
        }, 20);
    }, [navigate]);
    const navigateBack = useCallback(() => {
        if (location.key !== "default") {
            navigateTo(-1);
        } else {
            navigateTo("/", { replace: true });
        }
    }, [location.key, navigateTo]);

    const [chatHistory, setChatHistory] = useState(null);
    const [userBondids, setUserBondids] = useState(null);
    const [usersDetails, setUsersDetails] = useState(null);
    const [usersHistory, setUsersHistory] = useState(null);

    const [loading, setLoading] = useState(true);
    const [friend, setFriend] = useState(null);


    const callbackError = useCallback((error) => {
        toast.error(String(error));
    }, []);

    useEffect(() => {
        user && snapShot(user, ({ history, users }) => {
            setUserBondids(history?.bondid);
            setChatHistory(history?.current);
            setUsersHistory(history?.contact);
            setUsersDetails(users);
            console.log(history, users);
        }, callbackError);
    }, [callbackError, user, userBondids]);

    useEffect(() => {
        if (userBondids) {
            if (friend) {
                setCurrentBond(userBondids[friend.id] ?? null);
            } else {
                setCurrentBond(undefined);
            }
        }
    }, [friend, userBondids]);

    useEffect(() => {
        if (chatHistory !== null && usersDetails !== null && usersHistory !== null && userBondids !== null) setLoading(false);
    }, [chatHistory, userBondids, usersDetails, usersHistory]);
    return (
        <>
            {isMobile && loading && <Users user={user} />}
            {isMobile && !loading && <Routes>
                <Route path="/*" element={<Users
                    user={user}
                    loading={loading}
                    back={navigateBack}
                    navigate={navigateTo}
                    friend={friend}
                    setFriend={setFriend}
                    chatHistory={chatHistory}
                    usersHistory={usersHistory}
                    usersDetails={usersDetails}
                />} />
            </Routes>}
        </>
    );
}

export default Handle;