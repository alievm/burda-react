// MainSection.jsx
import React, { useEffect, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    Button,
    Dropdown,
    Input,
    Layout, Modal,
    Space,
    Table,
    notification, Spin, Popconfirm, Radio, Form, Switch, Flex, Divider, Pagination, Segmented, DatePicker, Collapse
} from 'antd';
import DragHandle from "../../../../components/DragHandle.jsx";
import Row from '../../../../components/Row.jsx'
const { Search } = Input;
import {
    createMainCategory,
    deleteMainCategory,
    fetchMainCategories, updateMainCategory
} from '../../../../service/directories/mainCategoryService.js';
import {FaPencilAlt} from "react-icons/fa";
import {MdAddToPhotos, MdDeleteSweep} from "react-icons/md";
import {Content, Footer} from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import {contentStyle, footerStyle, headerStyle, layoutStyle, siderStyle} from "./components/layoutStyles.js";
import {CurrencyCard} from "../../../Dashboard/components/CurrencyCard.jsx";
import {BsGripVertical, BsThreeDotsVertical} from "react-icons/bs";
import {currencyData} from "../../../../utils/currencyData.js";
import ColumnSearch from "./components/ColumnSearch.jsx";
import {CgMenuGridO} from "react-icons/cg";
import {RiSearch2Line} from "react-icons/ri";
import {AiFillSetting, AiOutlineDown} from "react-icons/ai";
import {VscListFlat, VscListSelection} from "react-icons/vsc";
import {RxListBullet} from "react-icons/rx";
import {EyeIcon, EyeSlashIcon, FolderPlusIcon} from "@heroicons/react/24/solid/index.js";

const { Panel } = Collapse;

const defaultTitle = () => 'Here is title';
const defaultFooter = () => 'Here is footer';
const MainSection = () => {
    const [dataSource, setDataSource] = useState([]);
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [newCategoryTitle, setNewCategoryTitle] = useState('');
    const [editCategoryTitle, setEditCategoryTitle] = useState('');
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading indicator
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
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchMainCategoriesData();
    }, []);

    useEffect(() => {
        // Фильтруем данные при изменении текста поиска
        const filtered = dataSource.filter(item =>
            item.title.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredDataSource(filtered);
    }, [searchText, dataSource]);

    const fetchMainCategoriesData = async () => {
        setLoading(true);
        try {
            const categories = await fetchMainCategories();
            if (Array.isArray(categories)) {
                const formattedCategories = categories.map((category) => ({
                    key: category.id.toString(),
                    title: category.title,
                    created_at: category.created_at,
                    updated_at: category.updated_at
                }));
                setDataSource(formattedCategories);
                setFilteredDataSource(formattedCategories);
                setTotal(formattedCategories.length);
            } else {
                console.error('Error: Expected an array of categories, got:', categories);
            }
        } catch (error) {
            console.error('Error fetching main categories:', error.message);
        } finally {
            setLoading(false);
        }
    };


    const titleColumnSearchProps = ColumnSearch({
        dataIndex: 'title',
        searchText,
        setSearchText,
        searchedColumn,
        setSearchedColumn
    }).getColumnSearchProps();

    const columns = [
        {
            key: 'sort',
            align: 'center',
            width: 80,
            render: () => <DragHandle />,
        },
        {
            title: '#',
            dataIndex: 'key',
            align: 'center',
            sorter: (a, b) => a.key.localeCompare(b.key),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Наименование',
            dataIndex: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            sortDirections: ['ascend', 'descend'],
            ...titleColumnSearchProps,
            fixed: 'left',

        },
        {
            title: 'Действия',
            dataIndex: 'actions',
            render: (text, record) => (
                <Space size="small">
                    <Button className="flex items-center" icon={<FaPencilAlt/>} type="primary" size="middle" onClick={() => handleEdit(record)}>Изменить</Button>
                    <Popconfirm title="Вы хотите удалить ?" onConfirm={() => handleDeleteCategory(record.key)}>
                        <Button type="default" className="flex items-center" icon={<MdDeleteSweep size="20"/>} size="middle" >Удалить</Button>
                    </Popconfirm>
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

    const handleEdit = (record) => {
        setEditCategoryId(record.key);
        setEditCategoryTitle(record.title);
        setIsModalVisible(true);
    };

    const handleCreateCategory = () => {
        setNewCategoryTitle('');
        setEditCategoryId(null);
        setIsModalVisible(true);
    };

    const handleUpdateCategory = async () => {
        if (!editCategoryTitle.trim()) {
            return notification.error({
                message: 'Validation Error',
                description: 'Category title cannot be empty',
            });
        }

        try {
            const updatedCategory = await updateMainCategory(editCategoryId, editCategoryTitle);

            setDataSource(prevState => {
                const updatedIndex = prevState.findIndex(item => item.key === updatedCategory.id);
                if (updatedIndex !== -1) {
                    prevState[updatedIndex] = {
                        ...prevState[updatedIndex],
                        title: updatedCategory.title,
                        updated_at: updatedCategory.updated_at,
                    };
                }
                return [...prevState];
            });

            fetchMainCategoriesData();
            setIsModalVisible(false);

            notification.success({
                message: 'Успешно изменено!',
                description: 'Категория была успешно изменена!',
            });
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to update category. Please try again later.',
            });
            console.error('Error updating main category:', error);
        }
    };

    const handleCreateNewCategory = async () => {
        if (!newCategoryTitle.trim()) {
            return notification.error({
                message: 'Validation Error',
                description: 'Category title cannot be empty',
            });
        }

        // Check if the category title already exists
        const isDuplicate = dataSource.some(category => category.title.toLowerCase() === newCategoryTitle.trim().toLowerCase());

        if (isDuplicate) {
            return notification.error({
                message: 'Дубликат',
                description: 'Категория с таким названием уже существует. Пожалуйста, выберите другое название.',
            });
        }

        try {
            const newCategory = await createMainCategory(newCategoryTitle);

            setFilteredDataSource(prevState => [
                {
                    key: newCategory.id,
                    title: newCategory.title,
                    created_at: newCategory.created_at,
                    updated_at: newCategory.updated_at,
                },
                ...prevState,
            ]);

            fetchMainCategoriesData();
            setIsModalVisible(false);

            notification.success({
                message: 'Успешно создано!',
                description: 'Новая категория была успешно добавлена!',
            });
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Failed to create category. Please try again later.',
            });
            console.error('Error creating main category:', error);
        }
    };



    const handleDeleteCategory = async (categoryId) => {
        try {
            const success = await deleteMainCategory(categoryId);

            if (success) {
                // Обновляем dataSource, удаляя категорию
                setDataSource(prevState => prevState.filter(item => item.key !== categoryId));

                notification.success({
                    message: 'Успешно удалено',
                    description: 'Категория была удалена!',
                });
            }
        } catch (error) {

            notification.error({
                message: 'Error',
                description: 'Failed to delete category. Please try again later.',
            });
            console.error('Error deleting main category:', error);
        }
    };




    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            setFilteredDataSource((prevState) => {
                const activeIndex = prevState.findIndex((record) => record.key === active?.id);
                const overIndex = prevState.findIndex((record) => record.key === over?.id);
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
                    <main className="flex items-center " >
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
                    <div className="flex items-center gap-4 px-6 py-5 max-md:flex-wrap max-md:px-5">
                        <div className="flex  flex-col flex-1 justify-center max-md:max-w-full">
                        <div
                                className="text-xl title-section font-extrabold tracking-normal text-sky-900 max-md:max-w-full">
                                Основной раздел
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
                        <Button  className="items-center text-sm flex" icon={<FolderPlusIcon className="h-5 w-6" />} size="large" type="primary" onClick={handleCreateCategory}>
                            Создать новую категорию
                        </Button>

                        <Modal
                            centered
                            title={editCategoryId ? 'Изменить категорию' : 'Добавить новую категорию'}
                            visible={isModalVisible}
                            onOk={editCategoryId ? handleUpdateCategory : handleCreateNewCategory}
                            onCancel={() => setIsModalVisible(false)}
                            okText={editCategoryId ? 'Сохранить' : 'Добавить'}
                            cancelText="Отмена"
                        >
                            <Input
                                placeholder="Введите название категории"
                                value={editCategoryId ? editCategoryTitle : newCategoryTitle}
                                onChange={(e) => editCategoryId ? setEditCategoryTitle(e.target.value) : setNewCategoryTitle(e.target.value)}
                            />
                        </Modal>
                        <Dropdown placement="bottom"  trigger={['click']}>
                            <Button type="text" onClick={(e) => e.preventDefault()}>
                                <BsThreeDotsVertical className="text-xl"/>
                            </Button>
                        </Dropdown>
                    </div>
                    <div className="w-full bg-gray-200 min-h-[1px] max-md:max-w-full"/>
                </div>
                <Layout style={layoutStyle}>
                    <Layout>
                        <Content style={contentStyle}>
                            <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                                <SortableContext items={filteredDataSource.map((i) => i.key)} strategy={verticalListSortingStrategy}>
                                    <Table
                                        {...tableProps}
                                        pagination={false}
                                        onChange={handleTableChange}
                                        scroll={scroll}
                                        loading={{ indicator: <div><Spin /></div>, spinning:!dataSource}}
                                        rowKey="key"
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
                </Layout>
            </div>


        </div>

)
;
};

export default MainSection;
