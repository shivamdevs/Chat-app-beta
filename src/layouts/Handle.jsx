import React, { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { startSnapShot, startUserShot } from '../fb.chat';
import Users from '../pages/Users';
import Preview from '../pages/Preview';
import Search from '../pages/Search';

function Handle({ user = null }) {
    const navigate = useNavigate();
    const location = useLocation();

    function navigateBack() {
        if (location.key !== "default") {
            navigateTo(-1);
        } else {
            navigateTo("/", { replace: true });
        }
    }
    const [navTimes, setNavTimes] = useState(1);
    function navigateTo(to, replace = false) {
        setNavTimes(old => ++old);
        setTimeout(() => {
            navigate(to, { replace });
            setNavTimes(old => --old);
        }, 200 * navTimes);
    }

    const [chatHistory, setChatHistory] = useState(null);
    const [usersDetails, setUsersDetails] = useState({});
    const [usersHistory, setUsersHistory] = useState([]);

    const callbackHistory = useCallback((snapShot) => {
        if (snapShot.empty) {
            setChatHistory([]);
        } else {
            const history = [];
            const already = [];
            snapShot.docs.sort((a, b) => a.data().updated - b.data().updated).reverse().forEach(shots => {
                const data = shots.data();
                const from = (() => {
                    if (user.uid === data.users[0]) return data.users[1];
                    if (user.uid === data.users[1]) return data.users[0];
                })();
                const sender = usersDetails[from];
                const push = {
                    id: shots.id,
                    to: sender?.id,
                    by: sender?.name,
                    as: sender?.profile,
                    at: data.updated,
                };
                already.push(sender?.id);
                history.push(push);
            });
            setChatHistory(history);
            setUsersHistory(already);
        }
    }, [user.uid, usersDetails]);

    const callbackUsers = useCallback((snapShot) => {
        if (snapShot.empty) {
            setUsersDetails({});
        } else {
            const result = {};
            snapShot.docs.forEach((users) => {
                const data = users.data();
                result[data.uid] = { ...data, id: users.id };
            });
            setUsersDetails(result);
        }
    }, []);

    const callbackError = useCallback((error) => {
        toast.error(String(error));
    }, []);

    useEffect(() => {
        startUserShot((snapShot) => {
            callbackUsers(snapShot);
            startSnapShot(user, callbackHistory, callbackError);
        }, callbackError);

    }, [callbackHistory, callbackError, user, callbackUsers]);
    return (
        <>
            {isMobile && !chatHistory && <Users user={user} />}
            {isMobile && chatHistory && <Routes>
                <Route path='/preview/*' element={<Preview back={navigateBack} />} />
                <Route path='/search' element={<Search navigate={navigateTo} back={navigateBack} users={usersDetails} history={usersHistory} />} />
                <Route path="/" element={<Users user={user} navigate={navigateTo} back={navigateBack} chatHistory={chatHistory} />} />
            </Routes>}
        </>
    );
}

export default Handle;