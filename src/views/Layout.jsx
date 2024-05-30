import React, {useState} from 'react';
import {Outlet} from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import ResponsiveAppBar from "../components/Navbar.jsx";
import {
    IconButton,
    Badge,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button, Switch,
} from "@material-tailwind/react";
import {VscGoToSearch} from "react-icons/vsc";
import {FiSearch} from "react-icons/fi";
import DarkMode from "../components/DarkTheme/DarkMode.jsx";

const Layout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [openNav, setOpenNav] = React.useState(false);
    const [toggled, setToggled] = useState(false);

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
        <div className={`app flex ${toggled ? 'toggled' : ''}`}>
            <Sidebar
                collapsed={collapsed}
                toggled={toggled}
                handleToggleSidebar={handleToggleSidebar}
                handleCollapsedChange={handleCollapsedChange}
            />
            <div className="w-full">
                <nav
                    className="bg-[#012C6E] border-b-[1px] border-gray-300 w-full top-0 z-10 h-max max-w-full rounded-none px-4 lg:px-8">
                    <div className="mx-auto max-w-full px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-end">
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

                            <div
                                className="py-1.5 px-5 rounded-[5px] bg-[#F6F8FA] w-2/4 max-w-sm items-center gap-2 hidden sm:flex group  border-[2px] border-transparent">
                                <FiSearch color="#637381" size="20"/>
                                <input
                                    type="text"
                                    className="outline-none placeholder-[#637381] bg-transparent w-4/5 group"
                                    placeholder="Искать..."
                                />
                            </div>
                            <div
                                className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <Menu placement="bottom-end"
                                      animate={{
                                          mount: {y: 0},
                                          unmount: {y: 25},
                                      }}
                                >
                                    <Badge className="" content="0">
                                        <MenuHandler>

                                            <div
                                                className="w-10 h-10 bg-[#F6F8FA] rounded-lg flex items-center justify-center border border-[#E7E7E7] cursor-pointer group">
                                                <svg
                                                    width="24"
                                                    height="26"
                                                    viewBox="0 0 24 26"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="group-hover:fill-[#012C6E] fill-[#637381]"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M7.05033 5.05025C8.36309 3.7375 10.1436 3 12.0001 3C13.8566 3 15.6371 3.7375 16.9498 5.05025C18.2626 6.36301 19.0001 8.14349 19.0001 10C19.0001 13.3527 19.7171 15.4346 20.378 16.6461C20.7098 17.2544 21.0329 17.6535 21.2573 17.8904C21.3698 18.0091 21.4581 18.0878 21.5114 18.1322C21.538 18.1544 21.5558 18.168 21.5635 18.1737C21.5647 18.1746 21.5657 18.1753 21.5664 18.1758C21.9249 18.4221 22.0835 18.8725 21.9572 19.2898C21.8295 19.7115 21.4407 20 21.0001 20H3.00008C2.55941 20 2.17068 19.7115 2.04299 19.2898C1.91664 18.8725 2.07528 18.4221 2.43377 18.1758C2.43447 18.1753 2.43542 18.1746 2.43663 18.1737C2.44432 18.168 2.46218 18.1544 2.4888 18.1322C2.54202 18.0878 2.6304 18.0091 2.74288 17.8904C2.9673 17.6535 3.29039 17.2544 3.62218 16.6461C4.28301 15.4346 5.00008 13.3527 5.00008 10C5.00008 8.14348 5.73758 6.36301 7.05033 5.05025ZM2.44388 18.169C2.44395 18.1689 2.44403 18.1688 2.44411 18.1688C2.44411 18.1688 2.4441 18.1688 2.4441 18.1688L2.44388 18.169ZM5.1494 18H18.8508C18.7747 17.8753 18.6983 17.7434 18.6222 17.6039C17.783 16.0654 17.0001 13.6473 17.0001 10C17.0001 8.67392 16.4733 7.40215 15.5356 6.46447C14.5979 5.52678 13.3262 5 12.0001 5C10.674 5 9.40223 5.52678 8.46454 6.46447C7.52686 7.40215 7.00008 8.67392 7.00008 10C7.00008 13.6473 6.21715 16.0654 5.37797 17.6039C5.30188 17.7434 5.22549 17.8753 5.1494 18Z"
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M9.76817 22.135C10.2459 21.8579 10.8578 22.0205 11.1349 22.4982C11.2228 22.6497 11.349 22.7755 11.5008 22.863C11.6526 22.9504 11.8247 22.9964 11.9999 22.9964C12.1751 22.9964 12.3472 22.9504 12.4991 22.863C12.6509 22.7755 12.777 22.6497 12.8649 22.4982C13.1421 22.0205 13.754 21.8579 14.2317 22.135C14.7094 22.4121 14.8721 23.024 14.5949 23.5018C14.3312 23.9564 13.9527 24.3337 13.4973 24.596C13.0419 24.8584 12.5255 24.9964 11.9999 24.9964C11.4744 24.9964 10.958 24.8584 10.5026 24.596C10.0472 24.3337 9.66866 23.9564 9.40494 23.5018C9.12782 23.024 9.29044 22.4121 9.76817 22.135Z"
                                                    />
                                                    <circle
                                                        cx="16"
                                                        cy="4"
                                                        r="3.5"
                                                        stroke="white"
                                                        className="group-hover:fill-[#012C6E] fill-[#DC3545]"
                                                    />
                                                </svg>
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
                <Outlet/>
            </div>
        </div>
    );
};

export default Layout;
