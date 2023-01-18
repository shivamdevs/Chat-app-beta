import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { auth } from './fb.user';
import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserView, MobileView } from "react-device-detect";
import Loading from "./layouts/Loading";
import './App.css';
import Default from "./pages/Default";
import Accounts from "myoasis-accounts";
import Handle from "./layouts/Handle";

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, loading, error] = useAuthState(auth);

    function navigateBack(times) {
        if (location.state?.from?.pathname) {
            navigate(-1);
        } else {
            navigate("/", { replace: true });
        }
    }

    useEffect(() => {
        if (error) console.error(error);
    }, [error, loading, navigate, user]);

    return (
        <>
            <BrowserView className="desktopView viewport">
                <Routes>
                    <Route path="/accounts/*" element={<Accounts onUserChange={() => navigateBack()} />} />
                    <Route path="/*" exact element={<Default />} />
                </Routes>
            </BrowserView>
            <MobileView className="mobileView viewport">
                <Routes>
                    <Route path="/accounts/*" element={<Accounts onUserChange={() => navigateBack()} />} />
                    <Route path="/*" exact element={<Default />} />
                </Routes>
            </MobileView>
            {loading && <Loading />}
        </>
    );
};

export default App;