import React, { useEffect, useState } from 'react';
import {
    Button,
    Collapse, DatePicker, Divider,
    Dropdown,
    Flex, Form,
    Input,
    Layout,
    Modal,
    notification, Pagination,
    Radio, Segmented,
    Select,
    Space,
    Spin,
    Table
} from 'antd';
import { BsThreeDotsVertical } from "react-icons/bs";
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
const { Panel } = Collapse;

import DragHandle from "../../../../components/DragHandle.jsx";
import Row from '../../../../components/Row.jsx'; // Ensure Row component is correctly defined
import {fetchCategories, createCategory, updateCategory, deleteCategory} from "../../../../service/directories/categoryService.jsx";
import {fetchAllTitles, fetchMainCategories, fetchTitles} from "../../../../service/directories/titleService.js";
import {FaPencilAlt} from "react-icons/fa";
import {MdDeleteSweep} from "react-icons/md";
import {siderStyle} from "../MainSection/components/layoutStyles.js";
import {currencyData} from "../../../../utils/currencyData.js";
import {CurrencyCard} from "../../../Dashboard/components/CurrencyCard.jsx";
import {AiFillSetting} from "react-icons/ai";
import {CgMenuGridO} from "react-icons/cg";
import {RiSearch2Line} from "react-icons/ri";
import {VscListFlat, VscListSelection} from "react-icons/vsc";
import {RxListBullet} from "react-icons/rx";
import {EyeIcon, EyeSlashIcon, FolderPlusIcon} from "@heroicons/react/24/solid/index.js";

const { Content, Sider } = Layout;

const CategorySection = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [modalData, setModalData] = useState({
        id: null,
        main_category_id: null,
        name_id: null,
        title: '',
    });

    const [mainCategories, setMainCategories] = useState([]);
    const [titlesData, setTitlesData] = useState([]);
    const [bordered, setBordered] = useState(false);
    const [size, setSize] = useState('large');
    const [showTitle, setShowTitle] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const [showFooter, setShowFooter] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const [hasData, setHasData] = useState(true);
    const [tableLayout, setTableLayout] = useState();
    const [top, setTop] = useState('none');
    const [bottom, setBottom] = useState('bottomRight');
    const [ellipsis, setEllipsis] = useState(false);
    const [yScroll, setYScroll] = useState(false);
    const [xScroll, setXScroll] = useState();
    // Pagination state
    const [current, setCurrent] = useState(1);
    const [searchText, setSearchText] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    useEffect(() => {
        fetchMainData();
        fetchMainCategoriesData();
        fetchTitlesData();
    }, []);

    useEffect(() => {
        // Фильтруем данные при изменении текста поиска
        const filtered = dataSource.filter(item =>
            item.title.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredDataSource(filtered);
    }, [searchText, dataSource]);

    const fetchMainData = async () => {
        setLoading(true);
        try {
            const result = await fetchCategories();
            setDataSource(result);
            setFilteredDataSource(result)
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось загрузить список категорий. Пожалуйста, попробуйте еще раз позже.',
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchMainCategoriesData = async () => {
        try {
            const categories = await fetchMainCategories();
            setMainCategories(categories);
        } catch (error) {
            console.error('Failed to fetch main categories:', error);
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось загрузить список основных категорий. Пожалуйста, попробуйте еще раз позже.',
            });
        }
    };

    const fetchTitlesData = async () => {
        setLoading(true);
        try {
            const titles = await fetchAllTitles();
            setTitlesData(titles); // Assuming fetchTitles returns an array
        } catch (error) {
            console.error('Failed to fetch titles:', error);
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось загрузить список наименований. Пожалуйста, попробуйте еще раз позже.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleModalCancel = () => {
        setModalVisible(false);
        setModalMode('add');
        setModalData({
            id: null,
            main_category_id: null,
            name_id: null,
            title: '',
        });
    };

    const handleCreate = async () => {
        const isDuplicate = dataSource.some(item =>
            item.main_category_id === modalData.main_category_id &&
            item.name_id === modalData.name_id &&
            item.title === modalData.title
        );

        if (isDuplicate) {
            notification.warning({
                message: 'Дубликат',
                description: 'Категория с такими значениями уже существует. Пожалуйста, введите другие данные.',
            });
            return; // Прерывание создания
        }


        try {
            const newData = {
                main_category_id: modalData.main_category_id,
                name_id: modalData.name_id,
                title: modalData.title,
            };
            const createdData = await createCategory(newData);
            fetchMainData();
            setModalVisible(false);
            notification.success({
                message: 'Успех',
                description: 'Новая категория успешно создана!',
            });
        } catch (error) {
            console.error('Failed to create category:', error);
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось создать новую категорию. Пожалуйста, попробуйте еще раз позже.',
            });
        }
    };

    const handleEdit = (record) => {
        setModalMode('edit');
        setModalData({
            id: record.id,
            main_category_id: record.main_category_id,
            name_id: record.name_id,
            title: record.title,
        });
        setModalVisible(true);
    };

    const handleUpdate = async () => {
        try {
            const { id, main_category_id, name_id, title } = modalData;
            await updateCategory(id, { main_category_id, name_id, title });
            notification.success({
                message: 'Успешно',
                description: 'Категория успешно обновлена.',
            });
            fetchMainData();
            handleModalCancel();
        } catch (error) {
            console.error('Failed to update category:', error);
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось обновить категорию. Пожалуйста, попробуйте еще раз позже.',
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteCategory(id);
            setFilteredDataSource(filteredDataSource.filter(item => item.id !== id));
            notification.success({
                message: 'Успешно',
                description: 'Категория успешно удалена.',
            });
            fetchTitlesData(); // Refresh titles data after delete
        } catch (error) {
            console.error('Failed to delete category:', error);
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось удалить категорию. Пожалуйста, попробуйте еще раз позже.',
            });
        }
    };

    const columns = [
        {
            key: 'sort',
            align: 'center',
            width: 80,
            render: () => <DragHandle />,
        },
        {
            title: 'Основная категория',
            dataIndex: 'main_category_id',
            key: 'main_category_id',
            render: (main_category_id) => {
                const category = mainCategories.find(cat => cat.value === main_category_id);
                return category ? category.label : 'Неизвестно';
            },
        },
        {
            title: 'Наименование',
            dataIndex: 'name_id',
            key: 'name_id',
            render: (name_id) => {
                const title = titlesData.find(cat => cat.value === name_id);
                return title ? title.label : 'Неизвестно';
            },
        },

        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (text, record) => (
                <Space size="small">
                    <Button icon={<FaPencilAlt/>} type="primary" className="flex items-center" onClick={() => handleEdit(record)}>Изменить</Button>
                    <Button icon={<MdDeleteSweep size="20"/>} className="flex items-center" onClick={() => handleDelete(record.id)} style={{ marginLeft: 8 }}>Удалить</Button>
                </Space>
            ),
        },
    ];

    const handleBorderChange = (enable) => {
        setBordered(enable);
    };
    const handleLoadingChange = (enable) => {
        setLoading(enable);
    };
    const handleSizeChange = (e) => {
        setSize(e.target.value);
    };
    const handleTableLayoutChange = (value) => {
        setTableLayout(value);
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setCurrent(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const handleEllipsisChange = (enable) => {
        setEllipsis(enable);
    };
    const handleTitleChange = (enable) => {
        setShowTitle(enable);
    };
    const handleHeaderChange = (enable) => {
        setShowHeader(enable);
    };
    const handleFooterChange = (enable) => {
        setShowFooter(enable);
    };
    const handleRowSelectionChange = (enable) => {
        setRowSelection(enable ? {} : undefined);
    };
    const handleYScrollChange = (enable) => {
        setYScroll(enable);
    };
    const handleXScrollChange = (value) => {
        setXScroll(value);
    };
    const handleDataChange = (newHasData) => {
        setHasData(newHasData);
    };
    const scroll = {};
    if (yScroll) {
        scroll.y = 240;
    }
    if (xScroll) {
        scroll.x = '100vw';
    }
    const tableColumns = columns.map((item) => ({
        ...item,
        ellipsis,
    }));
    if (xScroll === 'fixed') {
        tableColumns[0].fixed = true;
        tableColumns[tableColumns.length - 1].fixed = 'right';
    }
    const tableProps = {
        bordered,
        loading,
        size,
        title: showTitle ? defaultTitle : undefined,
        showHeader,
        footer: showFooter ? defaultFooter : undefined,
        rowSelection,
        scroll,
        tableLayout,
    };


    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            setFilteredDataSource((prevState) => {
                const activeIndex = prevState.findIndex((record) => record.id === active?.id);
                const overIndex = prevState.findIndex((record) => record.id === over?.id);
                return arrayMove(prevState, activeIndex, overIndex);
            });
        }
    };

    return (
        <div className="p-7 bg-[#F7F7F5]">
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
                                <div style={{backgroundColor: 'rgb(241 243 245)'}} className="p-2 mr-4 max-w-min title rounded-lg">
                                    <AiFillSetting size="25"/>
                                </div>
                                Конфигурация таблицы
                            </Flex>


                            <DatePicker placeholder="Искать по дате" className="w-full py-2"/>
                            <Segmented
                                options={[
                                    { label: 'Нижний левый', value: 'bottomLeft' },
                                    { label: 'Нижний центр', value: 'bottomCenter' },
                                    { label: 'Нижний правый', value: 'bottomRight' },
                                    { label: 'Ничто...', value: 'none' }
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
                                Категории
                            </div>
                            <div className="mt-1 text-sm leading-5 text-ellipsis text-slate-600 max-md:max-w-full">
                                Таблица данных
                            </div>
                        </div>
                        <Button
                            size="large"
                            className="flex items-center text-sm"
                            icon={isSidebarVisible ? <EyeIcon className="h-5 w-6" /> : <EyeSlashIcon className="h-5 w-6" />}
                            type="primary"
                            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                        >
                            {isSidebarVisible ? 'Скрыть панель' : 'Показать панель'}
                        </Button>
                        <Button  className="items-center text-sm flex" icon={<FolderPlusIcon className="h-5 w-6" />} size="large" type="primary" onClick={() => setModalVisible(true)}>
                            Создать новую категорию
                        </Button>
                        <Modal
                            centered
                            title={modalMode === 'add' ? 'Добавить новую категорию' : 'Редактировать категорию'}
                            visible={modalVisible}
                            onOk={modalMode === 'add' ? handleCreate : handleUpdate}
                            onCancel={handleModalCancel}
                            okText={modalMode === 'add' ? 'Добавить' : 'Сохранить'}
                            cancelText="Отмена"
                        >
                            <Select
                                placeholder="Выберите основную категорию"
                                style={{width: '100%', marginBottom: 16}}
                                value={modalData.main_category_id}
                                onChange={(value) => setModalData({...modalData, main_category_id: value})}
                            >
                                {mainCategories.map(category => (
                                    <Select.Option key={category.value}
                                                   value={category.value}>{category.label}</Select.Option>
                                ))}
                            </Select>
                            <Select
                                placeholder="Выберите наименование"
                                style={{width: '100%', marginBottom: 16}}
                                value={modalData.name_id}
                                onChange={(value) => setModalData({...modalData, name_id: value})}
                            >
                                {titlesData.map(title => (
                                    <Select.Option key={title.value} value={title.value}>{title.label}</Select.Option>
                                ))}
                            </Select>
                            <Input
                                placeholder="Введите название"
                                value={modalData.title}
                                onChange={(e) => setModalData({...modalData, title: e.target.value})}
                            />
                        </Modal>
                        <Dropdown placement="bottom" trigger={['click']}>
                            <Button type="text" onClick={(e) => e.preventDefault()}>
                                <BsThreeDotsVertical className="text-xl"/>
                            </Button>
                        </Dropdown>
                    </div>
                    <div className="w-full bg-gray-200 min-h-[1px] max-md:max-w-full"/>
                </div>
                <Layout className="relative">
                    <Content>
                        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                            <SortableContext items={filteredDataSource.map((item) => item.id)}
                                             strategy={verticalListSortingStrategy}>
                                <Table
                                    {...tableProps}
                                    pagination={false}
                                    onChange={handleTableChange}
                                    scroll={scroll}
                                    loading={{indicator: <div><Spin/></div>, spinning: !dataSource}}
                                    rowKey="id"
                                    components={{
                                        body: {
                                            row: Row,
                                        },
                                    }}
                                    columns={columns}
                                    dataSource={hasData ? filteredDataSource : []}
                                />
                            </SortableContext>
                        </DndContext>
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
                                    <Button  type="primary" size="large" shape="default"
                                             icon={<RiSearch2Line className="mx-5" size="20"/>}>
                                    </Button>
                                </form>
                                <Divider className="text-white">Параметры таблицы</Divider>
                                <Form className="mb-4">
                                    <Radio.Group className="flex mx-auto justify-center " buttonStyle="solid"  size="middle" value={size} onChange={handleSizeChange}>
                                        <Radio.Button value="large" className="flex items-center max-w-min"><VscListFlat/></Radio.Button>
                                        <Radio.Button value="middle" className="flex items-center max-w-min"><VscListSelection/></Radio.Button>
                                        <Radio.Button value="small" className="flex items-center max-w-min"><RxListBullet/></Radio.Button>
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
            </div>
        </div>
    );
};

export default CategorySection;
