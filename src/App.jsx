import React from 'react';
import {Route, Routes} from "react-router-dom";
import Homepage from "./views/Dashboard/Homepage.jsx";
import NotFoundPage from "./views/NotFoundPage.jsx";
import Layout from "./views/Layout.jsx";
import AllSources from './views/Directory/Finance/Sources/AllSources.jsx';
import CreateConsumption from './views/Directory/Consumption.jsx/CreateConsumption.jsx';
import AllConsumption from './views/Directory/Consumption.jsx/AllConsumption.jsx';
import ReceiverCategory from './views/Directory/ReceiverCategory.jsx';
import WareHouse from './views/Directory/WareHouse.jsx';
import MainSection from "./views/Directory/Raw/MainSection/MainSection.jsx";
import TitleSection from "./views/Directory/Raw/TitleSection/TitleSection.jsx";
import CategorySection from "./views/Directory/Raw/CategorySection/CategorySection.jsx";
import ViewsSection from "./views/Directory/Raw/ViewSection/ViewsSection.jsx";
import UnitSection from "./views/Directory/Raw/UnitSection/UnitSection.jsx";
import Size from "./views/Directory/Raw/Size/Size.jsx";
import Density from "./views/Directory/Raw/Density/Density.jsx";
import Season from "./views/Directory/Raw/Season/Season.jsx";
import Width from "./views/Directory/Raw/Width/Width.jsx";
import Currency from "./views/Directory/Finance/Currency/Currency.jsx";
import City from "./views/Directory/Finance/City/City.jsx";
import Types from "./views/Directory/Finance/Types/Types.jsx";
import Agent from "./views/Directory/Finance/Agent/Agent.jsx";
import AccountName from "./views/Directory/Finance/AccountName/AccountName.jsx";
import CreateSource from "./views/Directory/Finance/Sources/CreateSource.jsx";
import RawArrival from "./views/Warehouse/RawArrival.jsx";
import RawMaterialsWithZeroQuan from "./views/Warehouse/RawMaterialsWithZeroQuan.jsx";
import RawWarehouse from "./views/Warehouse/Warehouse.jsx";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
            <Route path="/" index element={<Homepage/>} />
            <Route path="/main-section" element={<MainSection/>} />
            <Route path="/title-section" element={<TitleSection/>} />
            <Route path="/category-section" element={<CategorySection/>} />
            <Route path="/view-section" element={<ViewsSection/>} />
            <Route path="/unit-section" element={<UnitSection/>} />
            <Route path="/size" element={<Size/>} />
            <Route path="/season" element={<Season/>} />
            <Route path="/density" element={<Density/>} />
            <Route path="/width" element={<Width/>} />
            <Route path="/currency" element={<Currency/>} />
            <Route path="/types" element={<Types/>} />
            <Route path="/city" element={<City/>} />
            <Route path="/agent" element={<Agent/>} />
            <Route path="/account-name" element={<AccountName/>}/>
            <Route path="/sources" element={<CreateSource/>} />
            <Route path="/all-sources" element={<AllSources/>} />
            <Route path="/consumption" element={<CreateConsumption/>} />
            <Route path="/sub-consumption" element={<AllConsumption/>} />
            <Route path="/receiver-category" element={<ReceiverCategory/>} />
            <Route path="/warehouse" element={<WareHouse/>} />
            <Route path="/raw-arrival" element={<RawArrival/>} />
            <Route path="/raw-arrival/raw-material-with-zero-quantity" element={<RawMaterialsWithZeroQuan/>} />
            <Route path="/raw-arrival/warehouse" element={<RawWarehouse/>} />
            <Route path="*" element={<NotFoundPage/>} />
            </Route>
        </Routes>
    );
};

export default App;
