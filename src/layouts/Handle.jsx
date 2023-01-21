import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import snapShot from '../fb.chat';
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
    const [usersDetails, setUsersDetails] = useState(null);
    const [usersHistory, setUsersHistory] = useState(null);
    const [userBondids, setUserBondids] = useState(null);

    const [loading, setLoading] = useState(true);


    const callbackError = useCallback((error) => {
        toast.error(String(error));
    }, []);

    useEffect(() => {
        user && snapShot(user, ({ bondid, current, contact, users }) => {
            setUserBondids(bondid);
            setChatHistory(current);
            setUsersHistory(contact);
            setUsersDetails(users);
            // console.log(bondid, current, contact, users);
        }, callbackError);
    }, [callbackError, user]);

    useEffect(() => {
        if (chatHistory !== null && usersDetails !== null && usersHistory !== null && userBondids !== null) setLoading(false);
    }, [chatHistory, userBondids, usersDetails, usersHistory]);
    return (
        <>
            {loading && <Users user={user} />}
            {!loading && <Routes>
                <Route path="/*" element={<Users
                    user={user}
                    loading={loading}
                    back={navigateBack}
                    navigate={navigateTo}
                    chatHistory={chatHistory}
                    userBondids={userBondids}
                    usersHistory={usersHistory}
                    usersDetails={usersDetails}
                />} />
            </Routes>}
        </>
    );
}

export default Handle;