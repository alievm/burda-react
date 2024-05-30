import React, {useState, Fragment} from 'react';
import ListBox from "./components/ListBox.jsx";
import { Select, Option } from "@material-tailwind/react";
import {CurrencyCard} from "./components/CurrencyCard.jsx";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {chartConfig} from "../../utils/chartConfig.js";
import Chart from 'react-apexcharts'
import {Listbox, Transition} from "@headlessui/react";

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
            <div className="relative mt-1">
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
            <h1 className="text-xl title font-extrabold tracking-normal text-sky-900  py-10">
                Годовые результаты наличия сырья на складе
            </h1>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                <div className="grid place-items-center grid-cols-2 gap-4">
                    <Select
                        label="Выберите основной раздел:"
                        color="blue"
                        animate={{
                            mount: {y: 0},
                            unmount: {y: 25},
                        }}
                    >
                        <Option>Material Tailwind HTML</Option>
                        <Option>Material Tailwind React</Option>
                        <Option>Material Tailwind Vue</Option>
                        <Option>Material Tailwind Angular</Option>
                        <Option>Material Tailwind Svelte</Option>
                    </Select> <Select color="blue"
                    label="Выберите вид:"
                    animate={{
                        mount: {y: 0},
                        unmount: {y: 25},
                    }}
                >
                    <Option>Material Tailwind HTML</Option>
                    <Option>Material Tailwind React</Option>
                    <Option>Material Tailwind Vue</Option>
                    <Option>Material Tailwind Angular</Option>
                    <Option>Material Tailwind Svelte</Option>
                </Select> <Select color="blue"
                    label="Выберите наименование товара:"
                    animate={{
                        mount: {y: 0},
                        unmount: {y: 25},
                    }}
                >
                    <Option>Material Tailwind HTML</Option>
                    <Option>Material Tailwind React</Option>
                    <Option>Material Tailwind Vue</Option>
                    <Option>Material Tailwind Angular</Option>
                    <Option>Material Tailwind Svelte</Option>
                </Select> <Select color="blue"
                    label="Выберите категорию:"
                    animate={{
                        mount: {y: 0},
                        unmount: {y: 25},
                    }}
                >
                    <Option>Material Tailwind HTML</Option>
                    <Option>Material Tailwind React</Option>
                    <Option>Material Tailwind Vue</Option>
                    <Option>Material Tailwind Angular</Option>
                    <Option>Material Tailwind Svelte</Option>
                </Select>
                </div>


                    <main className="">
                        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
                            {currencyData.map((data, index) => (
                                <CurrencyCard key={index} {...data} />
                            ))}
                        </div>
                    </main>
            </div>
            <div className="grd grid-cols-2">
                <div
                    className="px-4 py-4 bg-white flex-col sm:col-span-2 w-full max-h-64 xl:col-span-6 xl:row-start-2 lg:row-start-3 rounded-md border border-[#E7E7E7] ">
                    <div className="flex flex-col justify-between">
                        <div className="flex items-center justify-between ">
                  <span className="text-[#212B36] text-base font-semibold -tracking-[0.15px] whitespace-nowrap">
                  Ishchilarning ishlashi
                  </span>
                            <div className="sm:flex gap-2 items-center hidden">
                    <span className="text-sm font-medium text-[#212B36] -tracking-[0.15px] cursor-pointer">
                      Kunlik
                    </span>
                                <span className="text-[#637381] text-sm font-medium -tracking-[0.15px] cursor-pointer">
                      Haftalik
                    </span>
                                <span className="text-[#637381] text-sm font-medium -tracking-[0.15px] cursor-pointer">
                      Oylik
                    </span>
                                <span className="text-[#637381] text-sm font-medium -tracking-[0.15px] cursor-pointer">
                      Yillik
                    </span>
                            </div>
                            <div className=" block sm:hidden">
                                <DropDowns list={graphDropdown}/>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className=" w-full  h-full">
                            </div>
                        </div>
                    </div>
                </div>
                <div></div>
            </div>
        </div>
    );
};

export default Homepage;
