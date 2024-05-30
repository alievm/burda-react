import React, {useState, Fragment} from 'react';
import { Option } from "@material-tailwind/react";
import {CurrencyCard} from "./components/CurrencyCard.jsx";
import "react-day-picker/dist/style.css";
import {chartConfig} from "../../utils/chartConfig.js";
import { ru } from "date-fns/locale";
import Chart from 'react-apexcharts'
import {Listbox, Transition} from "@headlessui/react";
import { DayPicker } from "react-day-picker";
import {Calendar, Select, Table, Tabs} from "antd";


const dataSource1 = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    }, {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    }, {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
];

const columns1 = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
];

const dataSource2 = [
    {
        key: '1',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Red',
        age: 32,
        address: 'London No. 2 Lake Park',
    },
];

const columns2 = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
];


const graphDropdown = [
    { name: "Kunlik" },
    { name: "Haftalik" },
    { name: "Oylik" },
    { name: "Yillik" },
];
const resultDropdown = [{ name: "To'liq natija" }, { name: "Chorlik natija" }];

const DropDowns = ({ list }) => {
    const [selected, setSelected] = useState(list[0]);


    return (
        <Listbox value={selected} onChange={setSelected}>
            <div className="relative mt-1 ">
                <Listbox.Button className="py-2.5 px-2 border border-[#E7E7E7] flex justify-center items-center gap-1 rounded text-sm text-[#637381] font-normal">
                    <span className="block truncate">{selected.name}</span>{" "}
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect width="14" height="14" fill="white" />
                        <path
                            d="M11 5L7.5 8.5L4 5"
                            stroke="#637381"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute mt-1 z-50 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm min-w-[100px]">
                        {list?.map((person, personIdx) => (
                            <Listbox.Option
                                key={personIdx}
                                className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-2 pr-4 ${
                                        active ? "bg-[#F6F8FA] text-gray-900" : "text-gray-900"
                                    }`
                                }
                                value={person}
                            >
                                {({ selected }) => (
                                    <span
                                        className={`block truncate ${
                                            selected
                                                ? "font-medium text-[#212B36]"
                                                : "font-normal text-[#637381]"
                                        }`}
                                    >
                    {person.name}
                  </span>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
};

const Homepage = () => {
    const [selectedDate, setSelectedDate] = useState();
    const onPanelChange = (value, mode) => {
        console.log(value.format('YYYY-MM-DD'), mode);
    };

    const onChange = (key) => {
        console.log(key);
    };
    const options = {
        chart: {
            type: "pie",
            height: 120,
            width: 128,
        },
        title: false,
        series: [
            {
                name: "Data",
                data: [[23], [13], [62]],
            },
        ],
        exporting: {
            enabled: false,
        },
        credits: {
            enabled: false,
        },
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 100,
                    },
                },
            ],
        },
        legend: {
            enabled: false,
        },
        plotOptions: {
            pie: {
                borderWidth: 0,
                innerSize: "60%",
                dataLabels: {
                    enabled: false,
                },
                showInLegend: true,
                colors: ["#E5E5E5", "#18CDCA", "#012C6E"],
                states: {
                    hover: {
                        brightness: 0.1,
                    },
                },
            },
        },
    };

    const currencyData = [
        {
            currency: "USD",
            altText: "USD currency card",
            currentRate: "$151.74",
            change: "+4.44",
            changeColor: "text-lime-600",
            imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/300bc0ac8aba30e7896b29144fc0bbda8b6751162bd2a53be65a17ae0de40e37?apiKey=0e60d26ffe404316aa35b6241738714a&"
        },
        {
            currency: "UZS",
            altText: "UZS currency card",
            currentRate: "$151.74",
            change: "-4.44",
            changeColor: "text-red-500",
            imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/75aa21ca50397aadac5345c17e08ceb60b3f13b5e97d3c5f91e167d6ffd1ade0?apiKey=0e60d26ffe404316aa35b6241738714a&"
        },
        {
            currency: "EUR",
            altText: "EUR currency card",
            currentRate: "€151.74",
            change: "-4.44",
            changeColor: "text-red-500",
            imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/75aa21ca50397aadac5345c17e08ceb60b3f13b5e97d3c5f91e167d6ffd1ade0?apiKey=0e60d26ffe404316aa35b6241738714a&"
        }
    ];

    return (
        <div className="px-10">
            <h1 className="text-xl title font-extrabold leading-tight text-sky-900  py-5">
                Годовые результаты наличия сырья на складе
            </h1>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                <div className="grid place-items-center grid-cols-2 gap-4">
                    <Select className="w-full h-12"
                            suffixIcon={<img
                                loading="lazy"
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/785a626fdfb2d59d6c39f74656d6dff3c35546bec934a14c5e9c9c305595d0b4?apiKey=0e60d26ffe404316aa35b6241738714a&"
                                alt=""
                                className="w-full aspect-square max-w-[24px]"
                            />}
                            defaultValue="lucy"
                            options={[
                                {value: 'jack', label: 'Jack'},
                                {value: 'lucy', label: 'Выберите основной раздел:'},
                                {value: 'Yiminghe', label: 'yiminghe'},
                                { value: 'disabled', label: 'Disabled', disabled: true },
                        ]}
                    />
                    <Select
                        suffixIcon={<img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/785a626fdfb2d59d6c39f74656d6dff3c35546bec934a14c5e9c9c305595d0b4?apiKey=0e60d26ffe404316aa35b6241738714a&"
                            alt=""
                            className="w-full aspect-square max-w-[24px]"
                        />}
                        defaultValue="lucy"
                        className="w-full h-12"
                        options={[
                            { value: 'jack', label: 'Jack' },
                            { value: 'lucy', label: 'Выберите вид:' },
                            { value: 'Yiminghe', label: 'yiminghe' },
                            { value: 'disabled', label: 'Disabled', disabled: true },
                        ]}
                    /> <Select
                    suffixIcon={<img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/785a626fdfb2d59d6c39f74656d6dff3c35546bec934a14c5e9c9c305595d0b4?apiKey=0e60d26ffe404316aa35b6241738714a&"
                        alt=""
                        className="w-full aspect-square max-w-[24px]"
                    />}
                    defaultValue="lucy"
                    className="w-full h-12"
                    options={[
                        { value: 'jack', label: 'Jack' },
                        { value: 'lucy', label: 'Выберите наименование товара:' },
                        { value: 'Yiminghe', label: 'yiminghe' },
                        { value: 'disabled', label: 'Disabled', disabled: true },
                    ]}
                /> <Select
                    suffixIcon={<img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/785a626fdfb2d59d6c39f74656d6dff3c35546bec934a14c5e9c9c305595d0b4?apiKey=0e60d26ffe404316aa35b6241738714a&"
                        alt=""
                        className="w-full aspect-square max-w-[24px]"
                    />}
                    defaultValue="lucy"
                    className="w-full h-12"
                    options={[
                        { value: 'jack', label: 'Jack' },
                        { value: 'lucy', label: 'Выберите категорию:' },
                        { value: 'Yiminghe', label: 'yiminghe' },
                        { value: 'disabled', label: 'Disabled', disabled: true },
                    ]}
                />
                </div>


                    <main className="">
                        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
                            {currencyData.map((data, index) => (
                                <CurrencyCard key={index} {...data} />
                            ))}
                        </div>
                    </main>
            </div>
            <div className="">
                <div
                    className="px-4 grid overflow-hidden mt-7 grid-cols-1 lg:grid-cols-2 py-4  bg-white flex-col sm:col-span-2 w-full max-h-96 xl:col-span-6 xl:row-start-2 lg:row-start-3 rounded-md border border-[#E7E7E7] ">
                    <div className="flex mx-auto justify-between overflow-hidden">
                        <Chart {...chartConfig} />
                    </div>
                    {/*Second part*/}
                    <div>
                        <div className="p-5 bg-white rounded-md border border-sky-100 border-solid max-w-full">
                            <div className="block w-full lg:flex gap-5 max-md:flex-col max-md:gap-0">
                                <div className="flex flex-col ml-5 w-full lg:w-1/3 max-md:ml-0 max-md:w-full">
                                    <div className="flex flex-col leading-[150%]">
                                        <div
                                            className="flex gap-5 justify-between pr-2.5 pb-1.5 text-black whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <div className="text-xl font-semibold">124,854</div>
                                                <div className="text-base">Статистика</div>
                                            </div>
                                            <div
                                                className="flex justify-center items-center px-3 w-11 h-11 bg-[#012C6E] rounded-md shadow-sm">
                                                <img
                                                    loading="lazy"
                                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/741155f4680f989c00d90cb084886ba61b702123a198615f6bf3ed3c336741f7?apiKey=0e60d26ffe404316aa35b6241738714a&"
                                                    className="w-full aspect-square"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-3 text-sm text-slate-400">
                                            <div className="flex gap-2 whitespace-nowrap">
                                                <img
                                                    loading="lazy"
                                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/704d4c5bc15f5ee20b72bad2a2178494e97411d2d95773eca4f268f53d21c59d?apiKey=0e60d26ffe404316aa35b6241738714a&"
                                                    className="shrink-0 self-start w-5 aspect-square"
                                                />
                                                <div>7.2</div>
                                            </div>
                                            <div className="flex-1">+1.51%</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col ml-5 w-full lg:w-1/3 max-md:ml-0 max-md:w-full">
                                    <div className="flex flex-col leading-[150%]">
                                        <div
                                            className="flex gap-5 justify-between pr-2.5 pb-1.5 text-black whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <div className="text-xl font-semibold">124,854</div>
                                                <div className="text-base">Статистика</div>
                                            </div>
                                            <div
                                                className="flex justify-center items-center px-3 w-11 h-11 bg-[#012C6E] rounded-md shadow-sm">
                                                <img
                                                    loading="lazy"
                                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/741155f4680f989c00d90cb084886ba61b702123a198615f6bf3ed3c336741f7?apiKey=0e60d26ffe404316aa35b6241738714a&"
                                                    className="w-full aspect-square"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-3 text-sm text-slate-400">
                                            <div className="flex gap-2 whitespace-nowrap">
                                                <img
                                                    loading="lazy"
                                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/704d4c5bc15f5ee20b72bad2a2178494e97411d2d95773eca4f268f53d21c59d?apiKey=0e60d26ffe404316aa35b6241738714a&"
                                                    className="shrink-0 self-start w-5 aspect-square"
                                                />
                                                <div>7.2</div>
                                            </div>
                                            <div className="flex-1">+1.51%</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col ml-5 w-full lg:w-1/3 max-md:ml-0 max-md:w-full">
                                    <div className="flex flex-col leading-[150%]">
                                        <div
                                            className="flex gap-5 justify-between pr-2.5 pb-1.5 text-black whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <div className="text-xl font-semibold">124,854</div>
                                                <div className="text-base">Статистика</div>
                                            </div>
                                            <div
                                                className="flex justify-center items-center px-3 w-11 h-11 bg-[#012C6E] rounded-md shadow-sm">
                                                <img
                                                    loading="lazy"
                                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/741155f4680f989c00d90cb084886ba61b702123a198615f6bf3ed3c336741f7?apiKey=0e60d26ffe404316aa35b6241738714a&"
                                                    className="w-full aspect-square"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-3 text-sm text-slate-400">
                                            <div className="flex gap-2 whitespace-nowrap">
                                                <img
                                                    loading="lazy"
                                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/704d4c5bc15f5ee20b72bad2a2178494e97411d2d95773eca4f268f53d21c59d?apiKey=0e60d26ffe404316aa35b6241738714a&"
                                                    className="shrink-0 self-start w-5 aspect-square"
                                                />
                                                <div>7.2</div>
                                            </div>
                                            <div className="flex-1">+1.51%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<DayPicker  locale={ru} mode="default" selected={selectedDate} onSelect={setSelectedDate} />*/}
                        <div className=" calendar-section h-[30vh] overflow-y-auto">
                            <Calendar  onPanelChange={onPanelChange} />

                        </div>
                    </div>
                </div>
                <div></div>
            </div>

            <div >
                <h1 className="text-xl title font-extrabold leading-tight text-sky-900  py-5">
                    Склады
                </h1>
                <Tabs
                    onChange={onChange}
                    type="card"
                    items={[
                        {
                            label: 'Склад сырья',
                            key: '1',
                            children: <Table dataSource={dataSource1} columns={columns1}/>,
                        },
                        {
                            label: 'Склад готовой продукции',
                            key: '2',
                            children: <Table dataSource={dataSource2} columns={columns2}/>,
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default Homepage;
