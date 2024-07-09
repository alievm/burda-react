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
    TreeSelect, Typography,
} from "antd";
import {Header} from "antd/es/layout/layout.js";
import {Content, Footer} from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Title from "antd/es/typography/Title.js";

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

const RawArrival = () => {
    return (
        <div>
            <Layout className="h-[55vh]">
                <Header className="bg-white">
                    <div
                        className="text-xl mt-5 title-section font-extrabold tracking-normal text-sky-900 max-md:max-w-full">
                        Приход сырья
                    </div>
                </Header>
                <Layout className="bg-white">
                    <Content className="px-10">
                        <Form
                            layout="vertical"
                            {...formItemLayout}
                            variant="filled"
                            style={{
                                display: 'grid',  // Применяем CSS Grid
                                gridTemplateColumns: 'repeat(2, 2fr)',  // Два столбца, каждый по 1fr
                                gap: '1px'  // Расстояние между элементами
                            }}

                            labelCol={{
                                span: 20,
                            }}
                            wrapperCol={{
                                span: 20,
                            }}
                        >
                            <Form.Item
                                label="Дата прихода"
                                name="Дата прихода"
                            >
                                <Input size="large"  />
                            </Form.Item>

                            <Form.Item
                                label="Кто принимал"
                                name="Кто принимал"
                            >
                                <Input size="large"  />
                            </Form.Item>

                            <Form.Item
                                label="Поставщик"
                                name="Поставщик"
                            >
                                <Input size="large"  />
                            </Form.Item>

                            <Form.Item
                                label="Валюта"
                                name="Валюта"
                            >
                                <Input size="large"  />
                            </Form.Item>

                            <Form.Item
                                label="Курс валюта"
                                name="Курс валюта"
                            >
                                <Input size="large"  />
                            </Form.Item>

                            <Form.Item
                                label="Общая сумма по заявки с расходов"
                                name="Cascader"
                            >
                                <Input size="large"  />
                            </Form.Item>

                            <Form.Item
                                label="Фактический сумма с расходов"
                                name="Фактический сумма с расходов"
                            >
                                <TreeSelect />
                            </Form.Item>
                        </Form>
                    </Content>
                    <Sider className="px-10" style={{backgroundColor: '#fff'}} width="25%">
                        <DatePicker className="w-full py-3 mb-2" />
                        <div className="flex flex-col gap-4">
                            <div
                                className="flex gap-5 shadow overflow-hidden relative justify-between items-start py-4 pl-4 text-sm font-semibold text-black bg-white rounded-xl w-full">
                                <div className="my-auto">
                                    <Text>USD - Курс: 12,600 UZS (16:31:35)</Text>
                                </div>

                                <div className="absolute rounded-full h-12 w-12 right-0  bg-main">
                                    <img className="absolute top-1 left-2 h-8" src="/dollar-circle.svg"/>
                                </div>
                            </div>
                            <div
                                className="flex gap-5 shadow overflow-hidden relative justify-between items-start py-4 pl-4 text-sm font-semibold text-black bg-white rounded-xl w-full">
                                <div className="my-auto">
                                    <Text>USD - Курс: 12,600 UZS (16:31:35)</Text>
                                </div>

                                <div className="absolute rounded-full h-12 w-12 right-0  bg-main">
                                    <img className="absolute top-1 left-2 h-8" src="/dollar-circle.svg"/>
                                </div>
                            </div>
                            <div
                                className="flex gap-5 shadow overflow-hidden relative justify-between items-start py-4 pl-4 text-sm font-semibold text-black bg-white rounded-lg w-full">
                                <div className="my-auto">
                                    <Text>USD - Курс: 12,600 UZS (16:31:35)</Text>
                                </div>

                                <div className="absolute rounded-full h-12 w-12 right-0  bg-main">
                                    <img className="absolute top-1 left-2 h-8" src="/dollar-circle.svg"/>
                                </div>
                            </div>
                        </div>
                    </Sider>
                </Layout>
            </Layout>
        </div>
    );
};

export default RawArrival;
