import React, {useState, useEffect, useContext, useMemo, useRef} from 'react';
import {currencyData} from "../../../utils/currencyData.js";
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
    message, Space
} from "antd";
import Highlighter from 'react-highlight-words';
import { BsThreeDotsVertical } from "react-icons/bs";
import {LuSearch} from "react-icons/lu";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import {CurrencyCard} from "../../Dashboard/components/CurrencyCard.jsx";
import {fetchMainCategories, fetchTitles, createTitle, deleteNameById, editNameById} from "../../../service/directories/titleService.js";
import {IoCalendarSharp, IoCloseCircleSharp} from "react-icons/io5";

// Mock menu items for dropdown
const items = [
    { label: '1st menu item', key: '0' },
    { label: '2nd menu item', key: '1' },
    { type: 'divider' },
    { label: '3rd menu item', key: '3' },
];

const selectOptions = [
    { label: 'Option 1', value: 'Option 1' },
    { label: 'Option 2', value: 'Option 2' },
    { label: 'Option 3', value: 'Option 3' },
];

// Editable cell component
const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          mainCategoriesOptions,
                          ...restProps
                      }) => {
    let inputNode;

    if (dataIndex === 'main_category') {
        inputNode = (
            <Select
                placeholder="Выберите основной раздел"
                options={mainCategoriesOptions}
                value={record.main_category?.id} // Use value instead of defaultValue to reflect current selection
                onChange={(value) => {
                    // Handle onChange if necessary
                }}
                style={{ width: '100%' }}
            />
        );
    } else {
        inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    }

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: `Please Input ${title}!` }]}
                    initialValue={record[dataIndex]} // Keep initialValue for non-select fields
                >
                    {inputNode}
                </Form.Item>
            ) : (
                restProps.children
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
const TitleSection = () => {
    const [form] = Form.useForm();
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
    const [newRow, setNewRow] = useState(null);
    const [editingKey, setEditingKey] = useState('');
    const [mainCategories, setMainCategories] = useState([]);
    const [checkedList, setCheckedList] = useState(['main_category', 'title', 'operation']);
    const [mainCategoriesOptions, setMainCategoriesOptions] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    // Function to handle search
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    // Function to handle reset
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };


    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Искать...`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button className="flex items-center"
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<LuSearch className="text-lg" />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Искать
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Сбросить
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Фильтр
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => close()}
                    >
                        Закрыть
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <LuSearch
                className="text-lg"
                style={{ color: filtered ? '#1677ff' : undefined }}
            />
        ),
        onFilter: (value, record) => {
            // Приводим значение поля title к нижнему регистру и проверяем включение искомого значения
            return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) => (
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            )
        ),
    });


    // Define columns inside the component
    const columns = [
        {
            title: 'Основной раздел',
            dataIndex: 'main_category',
            render: (main_category) => main_category?.title,
            width: '40%',
            key: 'main_category',
            editable: true,
        },
        {
            title: 'Наименование',
            dataIndex: 'title',
            key: 'title',
            width: '40%',
            editable: true,
            ...getColumnSearchProps('title'),
        },
        {
            title: 'Действия',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
                            Сохранить
                        </Typography.Link>
                        <Popconfirm title="Вы хотите отменить ?" onConfirm={cancel}>
                            <a>Отмена</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <span className="flex items-center">
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)} style={{ marginRight: 8 }}>
                            <button
                                className="flex justify-center items-center px-1.5 py-2 w-8 h-8 rounded-md bg-gray-200">
                                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/82ca4f2625b4345dff2b3b5c99dc8a526ded8cd54dc4ce408ec4b6c7e754f7f2?apiKey=0e60d26ffe404316aa35b6241738714a&" className="w-4 aspect-square" />
                            </button>
                        </Typography.Link>
                        <Popconfirm title="Вы хотите удалить ?" onConfirm={() => handleDelete(record.id)}>
                            <button
                                className="flex justify-center items-center px-1.5 py-2 w-8 h-8 rounded-md bg-gray-200">
                                <img loading="lazy"
                                     src="https://cdn.builder.io/api/v1/image/assets/TEMP/1f7dcba834201c58a3f2ca7fc0537df8dcc1e1c9c165cdf4a82b8b53e59d7f32?apiKey=0e60d26ffe404316aa35b6241738714a&"
                                     className="w-4 aspect-square" />
                            </button>
                        </Popconfirm>
                    </span>
                );
            },
            key: 'operation',
        },
    ];


    const isEditing = (record) => record.id === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            main_category: record.main_category?.id, // Use id instead of title for the value
            title: record.title,
        });
        setEditingKey(record.id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (id) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => id === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingKey('');
                if (item.isNew) {
                    const response = await createTitle({ main_category_id: row.main_category, title: row.title });
                    const updatedItem = { ...response, main_category: { id: row.main_category } };
                    newData.splice(index, 1, updatedItem);
                    setData(newData);
                    await loadTitles();
                    messageApi.success('Наименование успешно добалено!');
                } else {
                    // Update record
                    await editNameById(id, { main_category_id: row.main_category, title: row.title });
                    await loadTitles();
                    messageApi.success('Наименование успешно изменено!');
                }
            }
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };




    const loadMainCategories = async () => {
        try {
            const options = await fetchMainCategories();
            setMainCategoriesOptions(options);
        } catch (error) {
            messageApi.error('Ошибка при загрузке основных разделов');
        }
    };

    const loadTitles = async () => {
        setLoading(true);
        try {
            const { data, total } = await fetchTitles(tableParams.pagination.current, tableParams.pagination.pageSize);
            setData(data);
            setTableParams((prev) => ({
                ...prev,
                pagination: {
                    ...prev.pagination,
                    total,
                },
            }));
        } catch (error) {
            messageApi.error('Ошибка при загрузке наименований');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTitles();
        loadMainCategories();
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
                inputType: col.dataIndex === 'main_category' ? 'select' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                mainCategoriesOptions, // Use mainCategoriesOptions from state
            }),
        };
    });

    // Function to add a new row
    const addRow = () => {
        const newRow = {
            id: `new_${Date.now()}`,
            main_category: null,
            title: '',
            isNew: true,
        };
        setData((prevData) => [newRow, ...prevData]);
        edit(newRow);
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

    const onDelete = (id) => {
        // Handle logic for deleting the row from state or performing other actions
        const newData = data.filter(item => item.id !== id);
        setData(newData);
    };

    const handleDelete = async (id) => {
        try {
            await deleteNameById(id);
            message.success('Наименование удалено!');
            onDelete(id); // Вызываем колбэк onDelete с id удаленной записи
        } catch (error) {
            console.error('Failed to delete name:', error);
            message.error('Failed to delete name');
        }
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


    const plainOptions = ['main_category', 'title', 'operation'];

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
            <div className="p-3 bg-white rounded-lg max-md:pr-5">
                <div className="flex container gap-5 max-md:flex-col max-md:gap-0">
                    <main className="">
                        <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
                            {currencyData.map((data, index) => (
                                <CurrencyCard key={index} {...data} />
                            ))}
                        </div>
                    </main>

                </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 border-solid shadow-sm h-full min-h-[85vh]">
                <div className="flex flex-col bg-white">
                    <div className="flex gap-4 px-6 py-5 max-md:flex-wrap max-md:px-5">
                        <div className="flex flex-col flex-1 justify-center max-md:max-w-full">
                            <div
                                className="text-xl title-section font-extrabold tracking-normal text-sky-900 max-md:max-w-full">
                                Наименование
                            </div>
                            <div className="mt-1 text-sm leading-5 text-ellipsis text-slate-600 max-md:max-w-full">
                                Таблица данных
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
                                <Button className="my-3" type="primary" onClick={addRow} style={{marginBottom: 16}}>
                                    Добавить Наименование
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
                                    loading={loading}
                                    rowKey="id"
                                    components={{
                                        body: {
                                            cell: EditableCell,
                                        },
                                    }}
                                    bordered
                                    dataSource={data}
                                    columns={mergedColumns}
                                    rowClassName="editable-row"
                                    pagination={tableParams.pagination}
                                    onChange={handleTableChange}
                                />
                            </Form>
                        </Content>
                        <Sider className="p-6 mt-9" style={{backgroundColor: 'white'}} width="30%">
                            <div
                                className="bg-white mx-auto px-4 rounded-xl border border-gray-200 border-solid max-w-[401px] min-h-[692px]">
                                <Divider>Календарь</Divider>
                                <DatePicker size="large" clearIcon={<IoCloseCircleSharp className="text-white text-lg" />} suffixIcon={<IoCalendarSharp className="text-white text-lg" />} className="w-full focus:text-white text-white"/>

                                <Divider>Отображаемые колонки</Divider>
                                <Checkbox.Group
                                    className="flex justify-start"
                                    value={checkedList}
                                    options={columns.map(({key, title}) => ({label: title, value: key}))}
                                    onChange={(value) => setCheckedList(value)}
                                />
                                <Divider>Поиск по наименованию</Divider>
                                <div className="flex gap-x-2">
                                    <div
                                        className="flex gap-4 px-5 py-3 text-sm whitespace-nowrap bg-white rounded border border-solid border-zinc-200 text-stone-400">
                                        <img loading="lazy"
                                             src="https://cdn.builder.io/api/v1/image/assets/TEMP/24df31ed478abab21edf594006b9ca1cd0db639191e697296e64ce3778623bb5?apiKey=0e60d26ffe404316aa35b6241738714a&"
                                             alt="Search Icon" className="shrink-0 w-4 aspect-square"/>
                                        <input type="text" placeholder="Искать..."
                                               className="flex-auto my-auto bg-transparent focus:outline-none"/>
                                    </div>
                                    <Button className="rounded-md h-11 text-md" type="primary" size="large" >
                                        Применить
                                    </Button>
                                </div>
                                <div className="flex items-center gap-4 w-full mt-4">
                                    <section
                                        className="flex gap-1 cursor-pointer w-full px-2 py-2 text-xs font-medium leading-6 text-center bg-white rounded border border-solid  border-zinc-300 text-zinc-800">
                                        <img loading="lazy"
                                             src="https://cdn.builder.io/api/v1/image/assets/TEMP/259641c197a5e63b594c2073eba240f20782c2be3214115da6b068df35671d45?apiKey=0e60d26ffe404316aa35b6241738714a&"
                                             alt="" className="shrink-0 aspect-square w-[26px]"/>
                                        <p className="my-auto">По Возрастанию</p>
                                    </section>

                                    <section
                                        className="flex gap-1 w-full px-2 cursor-pointer py-2 text-xs font-medium leading-6 text-center bg-white rounded border border-solid  border-zinc-300 text-zinc-800">
                                        <img
                                            loading="lazy"
                                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c39e5a4f17fe1f7e1beb64482df9adbf9dfbb132b182f1ea2e5a0352f6d47e59?apiKey=0e60d26ffe404316aa35b6241738714a&"
                                            className="shrink-0 aspect-square w-[26px]"
                                            alt=""
                                        />
                                        <p className="my-auto">По Убыванию</p>
                                    </section>
                                </div>

                                <Divider>Сдвинуть колонки по желанию</Divider>
                                <section
                                    className="flex mt-5 cursor-pointer gap-5 justify-start px-5 py-5 text-xs font-bold whitespace-nowrap bg-white rounded-md border border-solid border-neutral-200 text-zinc-800">
                                    <img
                                        loading="lazy"
                                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/5118e84094a7167a9b0ded5b68ccea8b57df652ad44a8e05297379233e52e765?apiKey=0e60d26ffe404316aa35b6241738714a&"
                                        alt=""
                                        className="shrink-0 self-start w-2.5 aspect-[0.56]"
                                    />
                                    <p>Основной раздел</p>
                                </section>
                                <section
                                    className="flex mt-5 cursor-pointer gap-5 justify-start px-5 py-5 text-xs font-bold whitespace-nowrap bg-white rounded-md border border-solid border-neutral-200 text-zinc-800">
                                    <img
                                        loading="lazy"
                                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/5118e84094a7167a9b0ded5b68ccea8b57df652ad44a8e05297379233e52e765?apiKey=0e60d26ffe404316aa35b6241738714a&"
                                        alt=""
                                        className="shrink-0 self-start w-2.5 aspect-[0.56]"
                                    />
                                    <p>Наименование</p>
                                </section>
                                <section
                                    className="flex mt-5 cursor-pointer gap-5 justify-start px-5 py-5 text-xs font-bold whitespace-nowrap bg-white rounded-md border border-solid border-neutral-200 text-zinc-800">
                                    <img
                                        loading="lazy"
                                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/5118e84094a7167a9b0ded5b68ccea8b57df652ad44a8e05297379233e52e765?apiKey=0e60d26ffe404316aa35b6241738714a&"
                                        alt=""
                                        className="shrink-0 self-start w-2.5 aspect-[0.56]"
                                    />
                                    <p>Действие</p>
                                </section>

                                <Divider>Количество строк и пагинация</Divider>
                                <Pagination
                                    className="space-y-3 justify-center flex-col items-center"
                                    current={tableParams.pagination.current}
                                    total={tableParams.pagination.total}
                                    pageSize={tableParams.pagination.pageSize}
                                    onChange={handlePageChange}
                                    showSizeChanger
                                    onShowSizeChange={handlePageChange}
                                />
                            </div>

                        </Sider>
                    </Layout>
                </Layout>
            </div>
        </div>
    );
};

export default TitleSection;

