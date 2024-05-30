import React from 'react';
import {Route, Routes} from "react-router-dom";
import Homepage from "./views/Dashboard/Homepage.jsx";
import NotFoundPage from "./views/NotFoundPage.jsx";
import Layout from "./views/Layout.jsx";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
            <Route path="/" index element={<Homepage/>} />
            <Route path="*" element={<NotFoundPage/>} />
            </Route>
        </Routes>
    );
};

export default App;
