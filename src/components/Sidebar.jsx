import {Link, NavLink, useLocation} from 'react-router-dom';
import {
    Sidebar as ProSidebar,
    Menu,
    MenuItem,
    SubMenu
} from 'react-pro-sidebar';
import {
    FaUser,
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
    FaList,
    FaHeart, FaMailBulk, FaSyncAlt
} from 'react-icons/fa';
import {RiHomeOfficeFill, RiMenu2Line, RiMenu3Line} from "react-icons/ri";
import {PiCashRegisterFill, PiChartLineUpFill, PiShippingContainerFill} from "react-icons/pi";
import {HiClipboardDocument, HiMiniInboxStack} from "react-icons/hi2";
import { Spin as Hamburger } from 'hamburger-react'
import {GrMoney, GrSync} from "react-icons/gr";
import {IoCut, IoDocumentAttach} from "react-icons/io5";
import {MdEditDocument} from "react-icons/md";
import {GiMoneyStack, GiReceiveMoney} from "react-icons/gi";
import {FaMoneyBills, FaTruckRampBox} from "react-icons/fa6";
import {SiAzureartifacts} from "react-icons/si";
import {BsFillTelephoneForwardFill} from "react-icons/bs";
import {Button} from "@material-tailwind/react";

const Sidebar = ({
                     collapsed,
                     toggled,
                     handleToggleSidebar,
                     handleCollapsedChange
                 }) => {
    const location = useLocation();

    const isActive = (path) => {
        const location = useLocation();
        return location.pathname === path;
    };

    return (
        <ProSidebar
            className="z-[999] hidden lg:block"
            collapsed={collapsed}
            toggled={toggled}
            onToggle={handleToggleSidebar}
            breakPoint="md"
            width="300px"

        >
            {/* Header */}

            <Menu iconShape="circle">
                {collapsed ? (
                    <MenuItem
                        icon={<RiMenu2Line size='20'/>}
                        onClick={handleCollapsedChange}
                    ></MenuItem>
                ) : (
                    <MenuItem
                        suffix={<RiMenu3Line size='20'/>}
                        onClick={handleCollapsedChange}
                    >
                        <div
                            style={{
                                padding: '9px',
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                                fontSize: 15,
                                letterSpacing: '1px'
                            }}
                        >
                            Burda
                        </div>
                    </MenuItem>
                )}
            </Menu>

            {/* Content */}

            <Menu iconShape="circle">
                <Link className={isActive('/') ? 'text-yellow-500' : ''}  to="/" >
                <MenuItem
                    icon={<RiHomeOfficeFill className={isActive('/') ? 'text-yellow-500' : ''} size={20}/>}
                >
                    Главная страница
                </MenuItem>
                </Link>
                <MenuItem icon={<PiChartLineUpFill className={isActive('/components') ? 'text-yellow-500' : ''} size={20}/>}>
                    Аналитика <Link className={isActive('/components') ? 'text-yellow-500' : ''} to="/components"/>
                </MenuItem>
                <SubMenu label={<div className={isActive('/main-section') || isActive('/title-section') || isActive('/category-section') || isActive('/view-section') || isActive('/unit-section') || isActive('/size') || isActive('/density') || isActive('/season') || isActive('/width') ? 'text-yellow-500' : ''}>Справочник</div>} icon={<HiClipboardDocument size="20"
                                                                                   className={isActive('/main-section') || isActive('/title-section') || isActive('/category-section') || isActive('/view-section') || isActive('/unit-section') || isActive('/size') || isActive('/density') || isActive('/season') || isActive('/width') ? 'text-yellow-500' : ''} />} size={20} >
                    <SubMenu label="Сырье">
                        <Link  className={isActive('/main-section') ? 'text-yellow-500' : ''} to="/main-section">
                        <MenuItem>Основной раздел</MenuItem>
                        </Link>
                        <Link className={isActive('/title-section') ? 'text-yellow-500' : ''} to="/title-section">
                        <MenuItem>Наименования</MenuItem>
                        </Link>
                        <Link className={isActive('/category-section') ? 'text-yellow-500' : ''} to="/category-section">
                        <MenuItem>Категория</MenuItem>
                        </Link>
                        <Link className={isActive('/view-section') ? 'text-yellow-500' : ''} to="/view-section">
                        <MenuItem>Вид</MenuItem>
                        </Link>
                        <Link className={isActive('/unit-section') ? 'text-yellow-500' : ''} to="/unit-section">
                        <MenuItem>Единица измерения</MenuItem>
                        </Link>
                        <Link className={isActive('/size') ? 'text-yellow-500' : ''} to="/size">
                        <MenuItem>Размер</MenuItem>
                        </Link>
                        <Link className={isActive('/density') ? 'text-yellow-500' : ''} to="/density">
                        <MenuItem>Плотность</MenuItem>
                        </Link>
                        <Link className={isActive('/season') ? 'text-yellow-500' : ''} to="/season">
                        <MenuItem>Сезон</MenuItem>
                        </Link>
                        <Link className={isActive('/width') ? 'text-yellow-500' : ''} to="/width">
                        <MenuItem>Ширина</MenuItem>
                        </Link>
                    </SubMenu>
                    <SubMenu label="Финансы">
                        <SubMenu label="Создание счета">
                        <Link className={isActive('/currency') ? 'text-yellow-500' : ''} to="/currency">
                            <MenuItem>Валюта</MenuItem>
                            </Link>
                            <Link className={isActive('/city') ? 'text-yellow-500' : ''} to="/city">
                            <MenuItem>Город</MenuItem>
                            </Link>
                            <Link className={isActive('/types') ? 'text-yellow-500' : ''} to="/types">
                            <MenuItem>Типы</MenuItem>
                            </Link>
                            <Link className={isActive('/agent') ? 'text-yellow-500' : ''} to="/agent">
                            <MenuItem>Субъект</MenuItem>
                            </Link>
                            <Link className={isActive('/account-name') ? 'text-yellow-500' : ''} to="/account-name">
                            <MenuItem>Название номера счета</MenuItem>
                            </Link>
                        </SubMenu>
                        <SubMenu label="Создание источника">
                        <Link className={isActive('/sources') ? 'text-yellow-500' : ''} to="/sources">
                            <MenuItem>Создать источники</MenuItem>
                            </Link>
                            <Link className={isActive('/all-sources') ? 'text-yellow-500' : ''} to="/all-sources">
                            <MenuItem>Все источники</MenuItem>
                            </Link>
                        </SubMenu>
                    </SubMenu>
                    <SubMenu label="Расходный субъект">
                    <Link className={isActive('/consumption') ? 'text-yellow-500' : ''} to="/consumption">
                        <MenuItem>Создать субъект</MenuItem>
                        </Link>
                        <Link className={isActive('/sub-consumption') ? 'text-yellow-500' : ''} to="/sub-consumption">
                        <MenuItem>Создать суб субъект</MenuItem>
                        </Link>
                    </SubMenu>
                    <Link className={isActive('/receiver-category') ? 'text-yellow-500' : ''} to="/receiver-category">
                    <MenuItem>Категория получателя</MenuItem>
                    </Link>
                    <MenuItem>Создание категории</MenuItem>
                    <Link className={isActive('/warehouse') ? 'text-yellow-500' : ''} to="/warehouse">
                    <MenuItem>Склады</MenuItem>
                    </Link>
                </SubMenu>
                <SubMenu
                    label={'Склад - сырья'}
                    icon={<HiMiniInboxStack size={20}/>}
                >
                    <MenuItem>Приход сырья</MenuItem>
                    <MenuItem>Склад</MenuItem>
                    <MenuItem>Сырье с нулевым количеством</MenuItem>
                    <SubMenu label="План факт">
                        <MenuItem>Наименование</MenuItem>
                        <MenuItem>Категория</MenuItem>
                        <MenuItem>Вид</MenuItem>
                    </SubMenu>
                    <MenuItem>Ручной приход</MenuItem>
                </SubMenu>
                <SubMenu label={'Заявки на поставку сырья'} icon={<FaMailBulk size="20"/>}>
                    <MenuItem>Все поставщики</MenuItem>
                    <MenuItem>Новая заявка</MenuItem>
                    <MenuItem>Все заявки</MenuItem>
                </SubMenu>
                <SubMenu label={'Взаиморасчет'} icon={<GrSync size="20"/>}>
                    <MenuItem>Взаиморасчет с поставщиками</MenuItem>
                    <MenuItem>Прочие взаиморасчеты</MenuItem>
                </SubMenu>
                <SubMenu label={'Заявки для производства'} icon={<MdEditDocument size="20"/>}>
                    <MenuItem>Новая заявка</MenuItem>
                </SubMenu>
                <SubMenu label={'Финансы'} icon={<FaMoneyBills size="20"/>}>
                    <MenuItem>Курс валют</MenuItem>
                    <MenuItem>Конвертация</MenuItem>
                    <SubMenu label={'Общие счета'}>
                        <MenuItem>Новая заявка</MenuItem>
                    </SubMenu>
                    <SubMenu label={'Расход'}>
                        <MenuItem>Денежные переводы</MenuItem>
                        <SubMenu label={'Создать категорию'}>
                            <MenuItem>Счет договор (расход)</MenuItem>
                            <MenuItem>Все платежи (расход)</MenuItem>
                            <MenuItem>Оплаченные (расход)</MenuItem>
                        </SubMenu>
                    </SubMenu>
                    <MenuItem>Начисления</MenuItem>
                    <MenuItem>Фактический доход</MenuItem>
                </SubMenu>
                <MenuItem icon={<PiCashRegisterFill size="20"/>}>Касса</MenuItem>
                <SubMenu icon={<IoCut size="20"/>} label={'Кройка'}>
                    <MenuItem>Кройка склад</MenuItem>
                </SubMenu>
                <SubMenu icon={<FaTruckRampBox size="20"/>} label={'Цех'}>
                    <MenuItem>Цех склад</MenuItem>
                </SubMenu>

            </Menu>

            {/* Footer */}

            {collapsed ? (
                <div
                    className="flex flex-col mx-auto px-4  pb-4 text-sm font-semibold text-center text-white rounded-md  bg-white bg-opacity-10  max-w-[58px]">
                    <div
                        className="flex gap-1.5 justify-center  mt-5 text-white rounded-md shadow-lg leading-[130%]">
                        <BsFillTelephoneForwardFill size="17" />
                    </div>
                </div>
            ) : (
                <div
                    className="flex flex-col mt-7 mx-auto px-4 pt-5 pb-4 text-sm font-semibold text-center text-white rounded-md bg-white bg-opacity-10 max-w-[208px]">
                    <div className="text-base tracking-normal leading-6">Call Centre</div>
                    <div className="mt-1.5 font-medium leading-[129%]">+998 90 909 90 90</div>
                    <Button
                        className="flex bg-main gap-1.5 justify-center items-center py-3 pr-6 pl-5 mt-5 text-white rounded-md shadow-lg leading-[130%]">
                        <BsFillTelephoneForwardFill size="13" />  <div className="font-medium capitalize">Позвонить</div>
                    </Button>
                </div>
            )}


        </ProSidebar>
    );
};

export default Sidebar;
