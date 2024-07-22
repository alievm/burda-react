import React, {useState} from 'react';
import {Outlet} from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

import {
    IconButton,
    Badge,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button, Switch, Typography, Avatar,
} from "@material-tailwind/react";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {Switch as SwitchTheme} from 'antd';
import {MdSunny} from "react-icons/md";
import {FiMenu} from "react-icons/fi";
import {BiChevronDown} from "react-icons/bi";
import {GoChevronDown} from "react-icons/go";
import {FaUserTie} from "react-icons/fa6";
import {VscSignOut} from "react-icons/vsc";
import {RiMenu2Line, RiShutDownLine} from "react-icons/ri";
import DarkMode from "../components/DarkMode.jsx";
import {BellIcon} from "@heroicons/react/24/outline/index.js";
import {IoMdClose} from "react-icons/io";

const profileMenuItems = [
    {
        label: "Мой Профиль",
        icon: FaUserTie,
    },
    {
        label: "Выйти из системы",
        icon: RiShutDownLine,
    },
];

const Layout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [openNav, setOpenNav] = React.useState(false);
    const [toggled, setToggled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const handleButtonClick = () => {
        setCollapsed(!collapsed);
    };

    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };
    const closeMenu = () => setIsMenuOpen(false);

    const handleCollapsedChange = () => {
        setCollapsed(!collapsed);
    };

    const handleImageChange = (checked) => {
        setImage(checked);
    };

    const handleToggleSidebar = (value) => {
        setToggled(value);
    };
    return (
        <div className={`app relative flex ${toggled ? 'toggled' : ''}`}>
           <div className="top-0 z-[10] sticky">
               <Sidebar
                   collapsed={collapsed}
                   toggled={toggled}
                   handleToggleSidebar={handleToggleSidebar}
                   handleCollapsedChange={handleCollapsedChange}
                   handleButtonClick={handleButtonClick}
               />
           </div>
            <div className="w-full relative">
                <nav
                    className="bg-main sticky  w-full top-0 z-10 h-max max-w-full rounded-none px-4 lg:px-8">
                    <div className="mx-auto max-w-full px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                <button
                                    type="button"
                                    className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                >
                                    <span className="absolute -inset-0.5"/>
                                    <span className="sr-only">Open main menu</span>
                                    <svg
                                        className="block h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                        />
                                    </svg>
                                </button>
                            </div>
                           <div className="flex items-center gap-3">
                              <div  onClick={handleButtonClick} className="bg-white p-2 rounded">
                                  {collapsed ? (   <RiMenu2Line  size='20'/>) : (  <IoMdClose   size='20'/>) }

                              </div>
                               <div className="flex flex-col">
                                   <h1 className="text-white font-bold">"Istam Group" МЧЖ</h1>
                                   <h1 className=" text-sm text-white/70">Производитель детской и подростковой одежды</h1>
                               </div>
                           </div>
                            <div
                                className="absolute inset-y-0 right-0 flex gap-x-3 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <DarkMode/>
                                <Menu placement="bottom-end"
                                      animate={{
                                          mount: {y: 0},
                                          unmount: {y: 25},
                                      }}
                                >
                                    <Badge className="bg-[#F7F7F5] text-black font-semibold" content="0">
                                        <MenuHandler>

                                            <div
                                                className="w-10 h-10 bg-[#F6F8FA] rounded-lg flex items-center justify-center border border-[#E7E7E7] cursor-pointer group">
                                                <BellIcon className="h-6 w-6"/>
                                            </div>
                                        </MenuHandler>

                                    </Badge>
                                    <MenuList>
                                        <MenuItem>Нету уведомлений</MenuItem>
                                    </MenuList>
                                </Menu>
                            </div>

                        </div>
                    </div>
                </nav>
                <div className="bg-[#fff]">
                    <Outlet/>
                </div>

            </div>
        </div>
    );
};

export default Layout;
