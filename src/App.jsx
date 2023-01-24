import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { auth } from './fb.user';
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "./layouts/Loading";
import './App.css';
import Default from "./pages/Default";
import Accounts from "myoasis-accounts";

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, loading, error] = useAuthState(auth);

    function navigateBack() {
        if (location.key !== "default" && location.pathname !== "/") {
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
            <Routes>
                <Route path="/accounts/*" element={<Accounts onUserChange={() => navigateBack()} />} />
                <Route path="/*" exact element={<Default />} />
            </Routes>
            {loading && <Loading />}
        </>
    );
};

export default App;