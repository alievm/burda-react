import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
    Dropdown,
    Button,
    Layout,
    Form,
    Input,
    InputNumber,
    Popconfirm,
    Table,
    Typography,
    Checkbox,
    Radio,
    Pagination, Divider, Select,
    DatePicker,
    message, Collapse, Flex, Segmented
} from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import qs from 'qs';
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {CurrencyCard} from "../../Dashboard/components/CurrencyCard.jsx";
import {siderStyle} from "../../../components/layoutStyles.js";
import {CgMenuGridO} from "react-icons/cg";
import {RiSearch2Line} from "react-icons/ri";
import {VscListFlat, VscListSelection} from "react-icons/vsc";
import {RxListBullet} from "react-icons/rx";
import {currencyData} from "../../../utils/currencyData.js";
import {AiFillSetting} from "react-icons/ai";
import {EyeIcon, EyeSlashIcon, FolderPlusIcon} from "@heroicons/react/24/solid/index.js";

// Mock menu items for dropdown
const items = [
    { label: '1st menu item', key: '0' },
    { label: '2nd menu item', key: '1' },
    { type: 'divider' },
    { label: '3rd menu item', key: '3' },
];

// Editable cell component
const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          ...restProps
                      }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: `Please Input ${title}!` }]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const getRandomuserParams = (params) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
});
const RowContext = React.createContext({});
const Types = () => {
    const [form] = Form.useForm();
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            total: 200, // Mock total count for pagination
        },
    });
    const [editingKey, setEditingKey] = useState('');
    const [checkedList, setCheckedList] = useState(['name', 'gender', 'email','code', 'operation']);

    // Define columns inside the component
    const columns = [
        {
            title: 'Наименование',
            dataIndex: 'name',
            sorter: true,
            render: (name) => `${name.first} ${name.last}`,
            filters: [
                { text: 'По Алфавиту', value: 'male' },
                { text: 'Самые новые', value: 'female' },
            ],
            width: '50%',
            key: 'name',
            editable: true,
        },
        {
            title: 'Код',
            dataIndex: 'code',
            key: 'code',
            width: '20%',
            editable: true,
        },
        {
            title: 'Действие',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
                            Сохранить
                        </Typography.Link>
                        <Popconfirm title="Вы хотите отменить ?" onConfirm={cancel}>
                            <a>Отмена</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <span className="flex items-center">
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}
                                         style={{marginRight: 8}}>
                            <button
                                className="flex justify-center items-center px-1.5 py-2 w-8 h-8 rounded-md bg-gray-200">
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/82ca4f2625b4345dff2b3b5c99dc8a526ded8cd54dc4ce408ec4b6c7e754f7f2?apiKey=0e60d26ffe404316aa35b6241738714a&"  className="w-4 aspect-square"/>
    </button>
                        </Typography.Link>
                        <Popconfirm title="Вы хотите удалить ?" onConfirm={() => deleteRow(record.key)}>
                            <button
                                className="flex justify-center items-center px-1.5 py-2 w-8 h-8 rounded-md bg-gray-200">
      <img loading="lazy"
           src="https://cdn.builder.io/api/v1/image/assets/TEMP/1f7dcba834201c58a3f2ca7fc0537df8dcc1e1c9c165cdf4a82b8b53e59d7f32?apiKey=0e60d26ffe404316aa35b6241738714a&"
           className="w-4 aspect-square"/>
    </button>
                        </Popconfirm>
                    </span>
                );
            },
            key: 'operation',
        },
    ];

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        // Convert name object to string for editing
        const nameString = `${record.name.first} ${record.name.last}`;
        form.setFieldsValue({name: nameString, gender: record.gender, email: record.email });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row, name: { first: row.name.split(' ')[0], last: row.name.split(' ')[1] } });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push({ ...row, name: { first: row.name.split(' ')[0], last: row.name.split(' ')[1] } });
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const deleteRow = (key) => {
        const newData = data.filter((item) => item.key !== key);
        setData(newData);
    };

    const fetchData = () => {
        setLoading(true);
        fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(tableParams))}`)
            .then((res) => res.json())
            .then(({ results }) => {
                // Map fetched data to match the required structure
                const mappedData = results.map((user) => ({
                    key: user.login.uuid,
                    name: user.name,
                    gender: user.gender,
                    email: user.email,
                    code: user.location.postcode,
                }));
                setData(mappedData);
                setFilteredDataSource(mappedData);
                setLoading(false);
                setTableParams((prev) => ({
                    ...prev,
                    pagination: {
                        ...prev.pagination,
                        total: 200, // Mock total count
                    },
                }));
            });
    };

    useEffect(() => {
        fetchData();
    }, [tableParams.pagination?.current, tableParams.pagination?.pageSize]);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    // Filter the columns based on checkedList
    const displayedColumns = columns.filter((col) => checkedList.includes(col.key));

    // Integrate editable columns with EditableCell component
    const mergedColumns = displayedColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    // Function to add a new row
    const addRow = () => {
        const newRow = {
            key: `new_${Date.now()}`, // Unique key for the new row
            name: { first: '', last: '' }, // Empty name object
            gender: '', // Empty gender
            email: '', // Empty email
        };
        setData([newRow, ...data]); // Add new row at the beginning
        setEditingKey(newRow.key); // Set the new row in edit mode
        messageApi.success('Добавлен в таблицу!');
        form.setFieldsValue({
            name: '',
            gender: '',
            email: '',
        });
    };

    const options = [
        {
            label: 'Lorem',
            value: 'Apple',
        },
        {
            label: 'Lorem',
            value: 'Pear',
        },
        {
            label: 'Lorem',
            value: 'Orange',
            title: 'Orange',
        },
    ];
    const [value4, setValue4] = useState('Apple');
    const onChange4 = ({ target: { value } }) => {
        console.log('radio4 checked', value);
        setValue4(value);
    };



    const handlePageChange = (page, pageSize) => {
        setTableParams((prev) => ({
            ...prev,
            pagination: {
                ...prev.pagination,
                current: page,
                pageSize: pageSize,
            },
        }));
    };

    const currencyData = [
        {
            currency: "Lorem",
            altText: "Lorem Lorem Lorem",
            currentRate: "151.74",
            change: "+4.44",
            changeColor: "text-lime-600",
            imageUrl: "https://cdn.builder.io/api/v1/image/assets/TEMP/300bc0ac8aba30e7896b29144fc0bbda8b6751162bd2a53be65a17ae0de40e37?apiKey=0e60d26ffe404316aa35b6241738714a&"
        }
    ];


    return (
        <div className="p-7 bg-[#F7F7F5]">
            {contextHolder}
            <div className="flex flex-col bg-white">
                <div className="flex gap-4 px-6 py-1 max-md:flex-wrap max-md:px-5">
                    <div className="flex flex-col flex-1 justify-center max-md:max-w-full">
                        <div
                            className="text-xl title-section font-extrabold tracking-normal text-sky-900 max-md:max-w-full">
                            Сводка данных
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-3  max-w-full bg-white rounded-lg max-md:pr-5 ">
                <div className="flex  gap-5 max-md:flex-col max-md:gap-0">
                    <main className="flex items-center ">
                        <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
                            {currencyData.map((data, index) => (
                                <CurrencyCard key={index} {...data} />
                            ))}
                        </div>
                        <Flex vertical gap="middle" className="p-3 rounded-lg border">
                            <Flex className="items-center">
                                <div style={{backgroundColor: 'rgb(241 243 245)'}}
                                     className="p-2 mr-4 max-w-min title rounded-lg">
                                    <AiFillSetting size="25"/>
                                </div>
                                Конфигурация таблицы
                            </Flex>


                            <DatePicker placeholder="Искать по дате" className="w-full py-2"/>
                            <Segmented
                                options={[
                                    {label: 'Нижний левый', value: 'bottomLeft'},
                                    {label: 'Нижний центр', value: 'bottomCenter'},
                                    {label: 'Нижний правый', value: 'bottomRight'},
                                    {label: 'Ничто...', value: 'none'}
                                ]}
                                value={bottom}
                                onChange={(value) => setBottom(value)}
                            />
                        </Flex>
                    </main>

                </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 border-solid shadow-sm h-full min-h-[85vh]">
                <div className="flex flex-col bg-white">
                    <div className="flex gap-4 px-6 py-5 max-md:flex-wrap max-md:px-5">
                        <div className="flex flex-col flex-1 justify-center max-md:max-w-full">
                            <div
                                className="text-xl title-section font-extrabold tracking-normal text-sky-900 max-md:max-w-full">
                                Типы
                            </div>
                            <div className="mt-1 text-sm leading-5 text-ellipsis text-slate-600 max-md:max-w-full">
                                Маленькая таблица
                            </div>
                        </div>
                        <Dropdown placement="bottom" menu={{items}} trigger={['click']}>
                            <Button type="text" onClick={(e) => e.preventDefault()}>
                                <BsThreeDotsVertical className="text-xl"/>
                            </Button>
                        </Dropdown>
                    </div>
                    <div className="w-full bg-gray-200 min-h-[1px] max-md:max-w-full"/>
                </div>
                <Layout className="min-h-full mx-5">
                    <Layout className="h-full bg-white">
                        <Content>
                            <div className="flex items-center gap-x-4">
                                    <Button
                                        size="large"
                                        className="flex items-center text-sm"
                                        icon={isSidebarVisible ? <EyeIcon className="h-5 w-6" /> : <EyeSlashIcon className="h-5 w-6" />}
                                        type="primary"
                                        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                                    >
                                        {isSidebarVisible ? 'Скрыть панель' : 'Показать панель'}
                                    </Button>
                                    <Button  className="items-center text-sm flex" icon={<FolderPlusIcon className="h-5 w-6" />} size="large" type="primary" onClick={addRow}>
                                        Добавить новый тип
                                    </Button>
                                <Radio.Group
                                    options={options}
                                    onChange={onChange4}
                                    value={value4}
                                    optionType="button"
                                    buttonStyle="solid"
                                />
                            </div>
                            <Form form={form} component={false}>
                                <Table
                                    components={{
                                        body: {
                                            cell: EditableCell,
                                        },
                                    }}
                                    bordered
                                    columns={mergedColumns}
                                    rowKey={(record) => record.key}
                                    dataSource={data}
                                    pagination={false}
                                    loading={loading}
                                    onChange={handleTableChange}
                                />
                            </Form>
                        </Content>
                        {isSidebarVisible && (
                            <Sider className="p-10" width="33%" style={siderStyle}>
                                <div
                                    className="bg-white mx-auto px-4 rounded-xl py-5 border border-gray-200 border-solid max-w-[401px] min-h-[692px]">
                                    <form className="flex gap-2 items-center max-w-full">
                                        <label htmlFor="simple-search" className="sr-only">
                                            Search
                                        </label>
                                        <div className="relative w-full">
                                            <div
                                                className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                                <CgMenuGridO className="text-black" size="18"/>
                                            </div>
                                            <input
                                                type="text"
                                                value={searchText}
                                                onChange={e => setSearchText(e.target.value)}
                                                id="simple-search"
                                                className=" border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:outline-none  block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Искать..."
                                                required=""
                                            />
                                        </div>
                                        <Button type="primary" size="large" shape="default"
                                                icon={<RiSearch2Line className="mx-5" size="20"/>}>
                                        </Button>
                                    </form>
                                    <Divider className="text-white">Параметры таблицы</Divider>
                                    <Form className="mb-4">
                                        <Radio.Group className="flex mx-auto justify-center " buttonStyle="solid"
                                                     size="middle" value={size} onChange={handleSizeChange}>
                                            <Radio.Button value="large"
                                                          className="flex items-center max-w-min"><VscListFlat/></Radio.Button>
                                            <Radio.Button value="middle"
                                                          className="flex items-center max-w-min"><VscListSelection/></Radio.Button>
                                            <Radio.Button value="small"
                                                          className="flex items-center max-w-min"><RxListBullet/></Radio.Button>
                                        </Radio.Group>
                                    </Form>
                                    <Collapse className="border-none" defaultActiveKey="1" accordion>
                                        <Panel className="border-none" header="Опции таблицы" key="1">
                                            <Form layout="inline" className="components-table-demo-control-bar">
                                                <Flex className="flex-col w-full gap-y-3">
                                                    <Form.Item className="w-full" label="Ограниченный">
                                                        <Segmented
                                                            block
                                                            options={['Нет', 'Да']}
                                                            value={bordered ? 'Да' : 'Нет'}
                                                            onChange={(value) => handleBorderChange(value === 'Да')}
                                                        />
                                                    </Form.Item>

                                                    <Form.Item className="w-full" label="Загрузка">
                                                        <Segmented
                                                            block
                                                            options={['Нет', 'Да']}
                                                            value={loading ? 'Да' : 'Нет'}
                                                            onChange={(value) => handleLoadingChange(value === 'Да')}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item className="w-full" label="Заголовок">
                                                        <Segmented
                                                            block
                                                            options={['Нет', 'Да']}
                                                            value={showTitle ? 'Да' : 'Нет'}
                                                            onChange={(value) => handleTitleChange(value === 'Да')}
                                                        />
                                                    </Form.Item>
                                                    {/*<Form.Item label="Нижний колонтитул">*/}
                                                    {/*    <Segmented*/}
                                                    {/*        options={['Нет', 'Да']}*/}
                                                    {/*        value={showFooter ? 'Да' : 'Нет'}*/}
                                                    {/*        onChange={(value) => handleFooterChange(value === 'Да')}*/}
                                                    {/*    />*/}
                                                    {/*</Form.Item>*/}
                                                    <Form.Item className="w-full" label="Флажки">
                                                        <Segmented
                                                            block
                                                            options={['Нет', 'Да']}
                                                            value={!!rowSelection ? 'Да' : 'Нет'}
                                                            onChange={(value) => handleRowSelectionChange(value === 'Да')}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item className="w-full" label="Фикс. заголовок">
                                                        <Segmented
                                                            block
                                                            options={['Нет', 'Да']}
                                                            value={!!yScroll ? 'Да' : 'Нет'}
                                                            onChange={(value) => handleYScrollChange(value === 'Да')}
                                                        />
                                                    </Form.Item>
                                                    {/*<Form.Item label="Имеет данные">*/}
                                                    {/*    <Segmented*/}
                                                    {/*        options={['Нет', 'Да']}*/}
                                                    {/*        value={!!hasData ? 'Да' : 'Нет'}*/}
                                                    {/*        onChange={(value) => handleDataChange(value === 'Да')}*/}
                                                    {/*    />*/}
                                                    {/*</Form.Item>*/}
                                                    {/*<Form.Item label="Эллипсис">*/}
                                                    {/*    <Segmented*/}
                                                    {/*        options={['Нет', 'Да']}*/}
                                                    {/*        value={!!ellipsis ? 'Да' : 'Нет'}*/}
                                                    {/*        onChange={(value) => handleEllipsisChange(value === 'Да')}*/}
                                                    {/*    />*/}
                                                    {/*</Form.Item>*/}
                                                </Flex>
                                            </Form>
                                        </Panel>
                                    </Collapse>


                                    <Pagination
                                        className="mt-7"
                                        current={current}
                                        pageSize={pageSize}
                                        total={total}
                                        onChange={(page, pageSize) => {
                                            setCurrent(page);
                                            setPageSize(pageSize);
                                        }}
                                    />
                                </div>
                            </Sider>
                        )}
                    </Layout>
                </Layout>
            </div>
        </div>
    );
};

export default Types;

