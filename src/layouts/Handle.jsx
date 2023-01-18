import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useLocation, useNavigate } from 'react-router-dom';
import { setTitle } from '../app.functions';
import Users from '../pages/Users';

function Handle({user = null}) {
    setTitle("Loading");
    const navigate = useNavigate();
    const location = useLocation();

    function navigateBack(times) {
        if (location.state?.from?.pathname) {
            navigate(-1);
        } else {
            navigate("/", { replace: true });
        }
    }

    const [chatHistory, setChatHistory] = useState(null);
    return (
        <>
            {isMobile && !chatHistory && <Users user={user} navigateBack={navigateBack} setChatHistory={setChatHistory} />}
        </>
    );
}

export default Handle;