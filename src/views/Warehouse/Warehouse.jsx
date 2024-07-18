import React from 'react';
import {
    Layout, Button,
    Cascader,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Mentions,
    Select,
    TreeSelect, Typography, Tabs, Segmented,
} from "antd";
import {Header} from "antd/es/layout/layout.js";
import {Content, Footer} from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Title from "antd/es/typography/Title.js";
import {FaDownload} from "react-icons/fa";
import {CurrencyDollarIcon} from "@heroicons/react/16/solid/index.js";
import {MdCurrencyExchange} from "react-icons/md";

const { Text } = Typography;
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 14,
        },
    },
};



const RawWarehouse = () => {
    return (
        <div>
            <Layout className="h-[65vh]">
                <Header className="bg-white h-5">

                </Header>
                <Layout className="bg-white">

                    <Content className="px-10 border mx-10 rounded-xl">
                        <div
                            className=" my-5 title-section font-semibold  text-sky-900 max-md:max-w-full">
                            <Segmented className="h-10 text-md items-center" options={['Склад', 'Возврат']} block />
                        </div>
                        <Form
                            layout="vertical"
                            {...formItemLayout}
                            variant="filled"
                            style={{
                                display: 'grid',  // Применяем CSS Grid
                                gridTemplateColumns: 'repeat(3, 2fr)',  // Два столбца, каждый по 1fr
                            }}
                            className="gap-x-3"
                            labelCol={{
                                span: 20,
                            }}
                            wrapperCol={{
                                span: 30,
                            }}
                        >
                            <div className="grid grid-cols-3 col-span-3 gap-x-10
                            ">
                                <Form.Item
                                    className="col-span-2"
                                    label="Номер заявки"
                                    name="Номер заявки"
                                >
                                    <TreeSelect placeholder="Номер заявки" className="w-full h-10"/>
                                </Form.Item>
                                <Form.Item
                                    className="col-span-1"
                                    label=" "
                                    name=" "
                                >
                                    <Button icon={<FaDownload/>} type="primary" className="w-full  h-10">Получение
                                        данных</Button>
                                </Form.Item>

                            </div>
                            <Form.Item
                                label="Дата прихода"
                                name="Дата прихода"
                            >
                                <Input placeholder="Дата прихода" disabled size="large"/>
                            </Form.Item>

                            <Form.Item
                                label="Кто принимал"
                                name="Кто принимал"
                            >
                                <Input placeholder="Кто принимал" disabled size="large"/>
                            </Form.Item>

                            <Form.Item
                                label="Поставщик"
                                name="Поставщик"
                            >
                                <Input placeholder="Поставщик" disabled size="large"/>
                            </Form.Item>

                            <Form.Item
                                label="Валюта"
                                name="Валюта"
                            >
                                <Input placeholder="Валюта" disabled size="large"/>
                            </Form.Item>

                            <Form.Item
                                label="Курс валюта"
                                name="Курс валюта"
                            >
                                <Input placeholder="Курс валюта" disabled size="large"/>
                            </Form.Item>

                            <Form.Item
                                label="Общая сумма с расходов"
                                name="Общая сумма с расходов"
                            >
                                <Input placeholder="Общая сумма с расходов"  disabled size="large"/>
                            </Form.Item>

                            <Form.Item
                                className="col-span-3"
                                label="Фактический сумма с расходов"
                                name="Фактический сумма с расходов"
                            >
                                <TreeSelect placeholder="Фактический сумма с расходов" className="w-full h-10"/>
                            </Form.Item>
                        </Form>
                    </Content>
                    <Sider className="p-5 mr-10  rounded-xl border " style={{backgroundColor: '#fff'}} width="25%">
                        <div
                            className="text-xl title-section font-extrabold tracking-normal text-sky-900 max-md:max-w-full">
                            Выберите валюту
                        </div>
                        <Form layout="vertical">
                            <Form.Item
                                required
                                name="Выберите дату"
                                label="Выберите дату">
                                <DatePicker className="w-full py-3 mb-2"/>
                            </Form.Item>
                            <Form.Item
                                required
                                name="Выберите валюту"
                                label="Выберите валюту">
                                <TreeSelect  suffixIcon={<MdCurrencyExchange  className="h-5 w-5" />} className="w-full h-10"/>
                            </Form.Item>
                        </Form>
                    </Sider>
                </Layout>
            </Layout>
        </div>
    );
};

export default RawWarehouse;
