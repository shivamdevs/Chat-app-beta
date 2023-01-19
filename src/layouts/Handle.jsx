import React, { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
// import { startSnapShot, startUserShot } from '../fb.chat';
import Users from '../pages/Users';
import Preview from './Preview';

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
    function navigateTo(to) {
        setNavTimes(old => ++old);
        setTimeout(() => {
            navigate(to);
            setNavTimes(old => --old);
        }, 200 * navTimes);
    }

    const [usersDetails, setUsersDetails] = useState({
        "8Gxt7axQ9KSbUlJkej8SdS7o55t2": {
            "profile": "https://lh3.googleusercontent.com/a/AEdFTp42CvOZK6nahlVkw27YqHqpxeOxlJVFlro5OzCtBHk=s96-c",
            "email": "pandasarthak12345@gmail.com",
            "name": "Sarthak Panda",
            "authProvider": "google",
            "uid": "8Gxt7axQ9KSbUlJkej8SdS7o55t2",
            "id": "6Ak0GLF7a0nYwG0hiZYa"
        },
        "L7ra5yfmMWNU0aB4QNzEqxT4duF3": {
            "email": "shivam@admin.com",
            "profile": "https://cdn.jsdelivr.net/gh/shivamdevs/Oasis-Assets@master/Images/Accounts/user-no-image.svg",
            "name": "Shivam Dewangan",
            "authProvider": "local",
            "uid": "L7ra5yfmMWNU0aB4QNzEqxT4duF3",
            "id": "PODidHmutQFRjapbaFsH"
        },
        "uT8Rq78UFXcOacQmdnb3BGtmSQy2": {
            "email": "shivamsubam@gmail.com",
            "uid": "uT8Rq78UFXcOacQmdnb3BGtmSQy2",
            "name": "Shivam Dewangan",
            "authProvider": "google",
            "profile": "https://lh3.googleusercontent.com/a/AEdFTp74VFovO11Li1ILhL9haWQY72KbYMZ89PwwhMigTQ=s96-c",
            "id": "RjlUnncyWfg7nVVPHJhG"
        },
        "KvgF9ZP4PUOPE8rZrLFO3BdulUE3": {
            "profile": "https://lh3.googleusercontent.com/a/AEdFTp7Tau-ODxiM85PePM2nuaM3Rtc3Q91n6TQSwAek=s96-c",
            "uid": "KvgF9ZP4PUOPE8rZrLFO3BdulUE3",
            "email": "dakpranay@gmail.com",
            "name": "Pranay dak",
            "authProvider": "google",
            "id": "TikciXPBEgdQf4QdH7T3"
        }
    });
    const [chatHistory, setChatHistory] = useState([
        {
            "id": "tRdGaXi3SZc8pONPm9rM",
            "to": "uT8Rq78UFXcOacQmdnb3BGtmSQy2",
            "by": "Shivam Dewangan",
            "as": "https://lh3.googleusercontent.com/a/AEdFTp74VFovO11Li1ILhL9haWQY72KbYMZ89PwwhMigTQ=s96-c"
        },
        {
            "id": "tRdGaXi3SZc8pONPm9rM",
            "to": "uT8Rq78UFXcOacQmdnb3BGtmSQy2",
            "by": "Shivam Dewangan",
            "as": "https://lh3.googleusercontent.com/a/AEdFTp74VFovO11Li1ILhL9haWQY72KbYMZ89PwwhMigTQ=s96-c"
        },
        {
            "id": "tRdGaXi3SZc8pONPm9rM",
            "to": "uT8Rq78UFXcOacQmdnb3BGtmSQy2",
            "by": "Shivam Dewangan",
            "as": "https://lh3.googleusercontent.com/a/AEdFTp74VFovO11Li1ILhL9haWQY72KbYMZ89PwwhMigTQ=s96-c"
        },
        {
            "id": "tRdGaXi3SZc8pONPm9rM",
            "to": "uT8Rq78UFXcOacQmdnb3BGtmSQy2",
            "by": "Shivam Dewangan",
            "as": "https://lh3.googleusercontent.com/a/AEdFTp74VFovO11Li1ILhL9haWQY72KbYMZ89PwwhMigTQ=s96-c"
        },
        {
            "id": "tRdGaXi3SZc8pONPm9rM",
            "to": "uT8Rq78UFXcOacQmdnb3BGtmSQy2",
            "by": "Shivam Dewangan",
            "as": "https://lh3.googleusercontent.com/a/AEdFTp74VFovO11Li1ILhL9haWQY72KbYMZ89PwwhMigTQ=s96-c"
        },
        {
            "id": "tRdGaXi3SZc8pONPm9rM",
            "to": "uT8Rq78UFXcOacQmdnb3BGtmSQy2",
            "by": "Shivam Dewangan",
            "as": "https://lh3.googleusercontent.com/a/AEdFTp74VFovO11Li1ILhL9haWQY72KbYMZ89PwwhMigTQ=s96-c"
        },
        {
            "id": "tRdGaXi3SZc8pONPm9rM",
            "to": "uT8Rq78UFXcOacQmdnb3BGtmSQy2",
            "by": "Shivam Dewangan",
            "as": "https://lh3.googleusercontent.com/a/AEdFTp74VFovO11Li1ILhL9haWQY72KbYMZ89PwwhMigTQ=s96-c"
        },
        {
            "id": "tRdGaXi3SZc8pONPm9rM",
            "to": "uT8Rq78UFXcOacQmdnb3BGtmSQy2",
            "by": "Shivam Dewangan",
            "as": "https://lh3.googleusercontent.com/a/AEdFTp74VFovO11Li1ILhL9haWQY72KbYMZ89PwwhMigTQ=s96-c"
        },
        {
            "id": "tRdGaXi3SZc8pONPm9rM",
            "to": "uT8Rq78UFXcOacQmdnb3BGtmSQy2",
            "by": "Shivam Dewangan",
            "as": "https://lh3.googleusercontent.com/a/AEdFTp74VFovO11Li1ILhL9haWQY72KbYMZ89PwwhMigTQ=s96-c"
        },
        {
            "id": "tRdGaXi3SZc8pONPm9rM",
            "to": "uT8Rq78UFXcOacQmdnb3BGtmSQy2",
            "by": "Shivam Dewangan",
            "as": "https://lh3.googleusercontent.com/a/AEdFTp74VFovO11Li1ILhL9haWQY72KbYMZ89PwwhMigTQ=s96-c"
        },
        {
            "id": "tRdGaXi3SZc8pONPm9rM",
            "to": "uT8Rq78UFXcOacQmdnb3BGtmSQy2",
            "by": "Shivam Dewangan",
            "as": "https://lh3.googleusercontent.com/a/AEdFTp74VFovO11Li1ILhL9haWQY72KbYMZ89PwwhMigTQ=s96-c"
        },
        {
            "id": "tRdGaXi3SZc8pONPm9rM",
            "to": "uT8Rq78UFXcOacQmdnb3BGtmSQy2",
            "by": "Shivam Dewangan",
            "as": "https://lh3.googleusercontent.com/a/AEdFTp74VFovO11Li1ILhL9haWQY72KbYMZ89PwwhMigTQ=s96-c"
        },
        {
            "id": "tRdGaXi3SZc8pONPm9rM",
            "to": "uT8Rq78UFXcOacQmdnb3BGtmSQy2",
            "by": "Shivam Dewangan",
            "as": "https://lh3.googleusercontent.com/a/AEdFTp74VFovO11Li1ILhL9haWQY72KbYMZ89PwwhMigTQ=s96-c"
        },
        {
            "id": "tRdGaXi3SZc8pONPm9rM",
            "to": "uT8Rq78UFXcOacQmdnb3BGtmSQy2",
            "by": "Shivam Dewangan",
            "as": "https://lh3.googleusercontent.com/a/AEdFTp74VFovO11Li1ILhL9haWQY72KbYMZ89PwwhMigTQ=s96-c"
        },
        {
            "id": "tRdGaXi3SZc8pONPm9rM",
            "to": "uT8Rq78UFXcOacQmdnb3BGtmSQy2",
            "by": "Shivam Dewangan",
            "as": "https://lh3.googleusercontent.com/a/AEdFTp74VFovO11Li1ILhL9haWQY72KbYMZ89PwwhMigTQ=s96-c"
        },
        {
            "id": "tRdGaXi3SZc8pONPm9rM",
            "to": "uT8Rq78UFXcOacQmdnb3BGtmSQy2",
            "by": "Shivam Dewangan",
            "as": "https://lh3.googleusercontent.com/a/AEdFTp74VFovO11Li1ILhL9haWQY72KbYMZ89PwwhMigTQ=s96-c"
        }
    ]);

    const callbackHistory = useCallback((snapShot) => {
        if (snapShot.empty) {
            setChatHistory([]);
        } else {
            const history = [];
            snapShot.docs.sort((a, b) => a.data().updated - b.data().updated).reverse().forEach(shots => {
                const data = shots.data();
                const to = (() => {
                    if (user.uid === data.users[0]) return data.users[1];
                    if (user.uid === data.users[1]) return data.users[0];
                })();
                const sender = usersDetails[to];
                const push = {
                    id: shots.id,
                    to,
                    by: sender?.name,
                    as: sender?.profile,
                    at: data.updated,
                };
                history.push(push);
                history.push(push);
                history.push(push);
                history.push(push);
                history.push(push);
                history.push(push);
                history.push(push);
                history.push(push);
                history.push(push);
                history.push(push);
                history.push(push);
                history.push(push);
                history.push(push);
                history.push(push);
                history.push(push);
                history.push(push);
            });
            setChatHistory(history);
        }
    }, [user.uid, usersDetails]);

    const callbackUsers = useCallback((snapShot) => {
        if (snapShot.empty) {
            setUsersDetails({});
        } else {
            const result = {};
            snapShot.docs.forEach((users) => {
                const data = users.data();
                result[data.uid] = {...data, id: users.id};
            });
            setUsersDetails(result);
        }
    }, []);

    const callbackError = useCallback((error) => {
        toast.error(String(error));
    }, []);

    useEffect(() => {
        // startUserShot((snapShot) => {
        //     callbackUsers(snapShot);
        //     startSnapShot(user, callbackHistory, callbackError);
        // }, callbackError);
        
    }, [callbackHistory, callbackError, user, callbackUsers]);
    return (
        <>
            {isMobile && !chatHistory && <Users user={user} />}
            {isMobile && chatHistory?.length > 0 && <Routes>
                <Route path='/preview/*' element={<Preview back={navigateBack} />} />
                <Route path="/" element={<Users user={user} navigate={navigateTo} back={navigateBack} chatHistory={chatHistory} />} />
            </Routes>}
        </>
    );
}

export default Handle;