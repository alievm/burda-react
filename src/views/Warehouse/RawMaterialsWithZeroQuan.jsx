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
import {FaDownload} from "react-icons/fa";
import {TbFilterDown} from "react-icons/tb";
import {BiDialpadAlt} from "react-icons/bi";

const { Text } = Typography;
const formItemLayout = {
    labelCol: {
        xs: {
            span: 44,
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

const RawMaterialsWithZeroQuan = () => {
    return (
        <div>
            <Layout className="h-[40vh]">
                <Header className="bg-white h-5">

                </Header>
                <Layout className="bg-white">

                    <Content className="px-10 border mx-10 rounded-xl">
                        <div
                            className="text-xl my-5 title-section font-extrabold tracking-normal text-sky-900 max-md:max-w-full">
                            Сырьё с нулевым количеством
                        </div>
                        <Form
                            layout="vertical"
                            {...formItemLayout}
                            variant="filled"
                            style={{
                                display: 'grid',  // Применяем CSS Grid
                                gridTemplateColumns: 'repeat(4, 2fr)',  // Два столбца, каждый по 1fr
                            }}
                            className="gap-x-3"
                            labelCol={{
                                span: 20,
                            }}
                            wrapperCol={{
                                span: 30,
                            }}
                        >
                            <Form.Item
                                label="Основной раздел"
                                name="Основной раздел"
                            >
                                <TreeSelect placeholder="Основной раздел" className="w-full h-10"/>
                            </Form.Item>

                            <Form.Item
                                label="Наименование"
                                name="Наименование"
                            >
                                <TreeSelect placeholder="Наименование товара" className="w-full h-10"/>
                            </Form.Item>

                            <Form.Item
                                label="Категория"
                                name="Категория"
                            >
                                <TreeSelect placeholder="Категория" className="w-full h-10"/>
                            </Form.Item>

                            <Form.Item
                                label="Вид"
                                name="Вид"
                            >
                                <TreeSelect placeholder="Вид" className="w-full h-10"/>
                            </Form.Item>

                            <Form.Item
                                label="Поставщик"
                                name="Поставщик"
                            >
                                <TreeSelect placeholder="Поставщик" className="w-full h-10"/>
                            </Form.Item>

                            <Form.Item
                                label="Ширина"
                                name="Ширина"
                            >
                                <TreeSelect placeholder="Ширина" className="w-full h-10"/>
                            </Form.Item>
                            <Form.Item
                                label="Размер"
                                name="Размер"
                            >
                                <Input placeholder="Размер" className="w-full h-10"/>
                            </Form.Item>
                            <Form.Item
                                label="Код"
                                name="Код"
                            >
                                <Input placeholder="Код" className="w-full h-10"/>
                            </Form.Item>
                        </Form>
                    </Content>
                    <Sider className="p-5 mr-10  rounded-xl border " style={{backgroundColor: '#fff'}} width="20%">
                        <div
                            className="text-xl mb-4  title-section font-extrabold tracking-normal text-sky-900 max-md:max-w-full">
                           Номер заявки
                        </div>
                        <Form layout="vertical">
                            <Form.Item
                                name="Номер заявки"
                              >
                                <Input prefix={<BiDialpadAlt size="20"  />} placeholder="Номер заявки" className="w-full py-2"/>
                            </Form.Item>
                            <Button icon={<TbFilterDown size="20" />} type="primary" className="w-full flex items-center justify-center h-10">
                                Фильтр
                            </Button>
                        </Form>
                    </Sider>
                </Layout>
            </Layout>
        </div>
    );
};

export default RawMaterialsWithZeroQuan;
