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
    notification, Spin, Popconfirm, Radio, Form, Switch, Flex, Divider
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
import {AiFillSetting} from "react-icons/ai";



const defaultTitle = () => 'Here is title';
const defaultFooter = () => 'Here is footer';
const MainSection = () => {
    const [dataSource, setDataSource] = useState([]);
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

    useEffect(() => {
        fetchMainCategoriesData();
    }, []);

    const fetchMainCategoriesData = async () => {
        setLoading(true); // Set loading to true when fetching starts
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
    const handleTableLayoutChange = (e) => {
        setTableLayout(e.target.value);
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
    const handleXScrollChange = (e) => {
        setXScroll(e.target.value);
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

        try {
            const newCategory = await createMainCategory(newCategoryTitle);

            setDataSource(prevState => [
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

                // Уведомляем пользователя об успешном удалении категории
                notification.success({
                    message: 'Успешно удалено',
                    description: 'Категория была удалена!',
                });
            }
        } catch (error) {
            // Обрабатываем ошибки при удалении категории
            notification.error({
                message: 'Error',
                description: 'Failed to delete category. Please try again later.',
            });
            console.error('Error deleting main category:', error);
        }
    };




    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            setDataSource((prevState) => {
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
                    <main className="flex items-center ">
                        <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
                            {currencyData.map((data, index) => (
                                <CurrencyCard key={index} {...data} />
                            ))}
                        </div>
                        <Flex vertical gap="middle">
                            <Flex className="items-center">
                                <div style={{backgroundColor: 'rgb(241 243 245)'}} className="p-2 mr-4 max-w-min title rounded-full">
                                    <AiFillSetting size="25"/>
                                </div>
                                Конфигурация таблицы
                            </Flex>
                            <Radio.Group buttonStyle="outline" value={size} onChange={handleSizeChange}>
                                <Radio.Button value="large">Большой</Radio.Button>
                                <Radio.Button value="middle">Средний</Radio.Button>
                                <Radio.Button value="small">Маленький</Radio.Button>
                            </Radio.Group>
                            <Radio.Group value={xScroll} onChange={handleXScrollChange}>
                                <Radio.Button value={undefined}>Сбросить</Radio.Button>
                                <Radio.Button value="scroll">Прокрутка</Radio.Button>
                                <Radio.Button value="fixed">Фиксированные столбцы</Radio.Button>
                            </Radio.Group>
                            <Radio.Group value={tableLayout} onChange={handleTableLayoutChange}>
                                <Radio.Button value={undefined}>Сбросить</Radio.Button>
                                <Radio.Button value="fixed">Фиксированный</Radio.Button>
                            </Radio.Group>
                            <Radio.Group
                                value={bottom}
                                onChange={(e) => {
                                    setBottom(e.target.value);
                                }}
                            >
                                <Radio.Button value="bottomLeft">Нижний левый</Radio.Button>
                                <Radio.Button value="bottomCenter">Нижний центр</Radio.Button>
                                <Radio.Button value="bottomRight">Нижний правый</Radio.Button>
                                <Radio.Button value="none">Ничто...</Radio.Button>
                            </Radio.Group>
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
                                Основной раздел
                            </div>
                            <div className="mt-1 text-sm leading-5 text-ellipsis text-slate-600 max-md:max-w-full">
                                Таблица данных
                            </div>
                        </div>
                        <Button  className="items-center flex" icon={<MdAddToPhotos size="20" />} size="large" type="primary" onClick={handleCreateCategory}>
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
                                <SortableContext items={dataSource.map((i) => i.key)} strategy={verticalListSortingStrategy}>
                                    <Table
                                        {...tableProps}
                                        pagination={{
                                            position: [top, bottom],
                                        }}
                                        scroll={scroll}
                                        loading={{ indicator: <div><Spin /></div>, spinning:!dataSource}}
                                        rowKey="key"
                                        components={{
                                            body: {
                                                row: Row,
                                            },
                                        }}
                                        columns={columns}
                                        dataSource={hasData ? dataSource : []}
                                    />
                                </SortableContext>
                            </DndContext>
                        </Content>
                        <Sider className="p-10" width="28%" style={siderStyle}>
                            <form className="flex gap-2 items-center max-w-full">
                                <label htmlFor="simple-search" className="sr-only">
                                    Search
                                </label>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <CgMenuGridO className="text-black"  size="18"/>
                                    </div>
                                    <input
                                        type="text"
                                        id="simple-search"
                                        className=" border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:outline-none  block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Искать..."
                                        required=""
                                    />
                                </div>
                               <Button className="h-10 bg-white hover:bg-white" type="link" size="large" shape="circle" icon={<RiSearch2Line size="20" />}>
                               </Button>
                            </form>
                            <Divider style={{color: '#fff'}} className="text-white">Дополнительные параметры таблицы</Divider>
                            <Form
                                layout="inline"
                                className="components-table-demo-control-bar "
                                style={{
                                    marginBottom: 16,
                                }}
                            >
                                <Form.Item className="text-white" label="Ограниченный">
                                    <Switch  checked={bordered} onChange={handleBorderChange} />
                                </Form.Item>
                                <Form.Item label="Загрузка">
                                    <Switch checked={loading} onChange={handleLoadingChange} />
                                </Form.Item>
                                <Form.Item label="Заголовок">
                                    <Switch checked={showTitle} onChange={handleTitleChange} />
                                </Form.Item>
                                <Form.Item label="Заголовок столбца">
                                    <Switch checked={showHeader} onChange={handleHeaderChange} />
                                </Form.Item>
                                <Form.Item label="Нижний колонтитул">
                                    <Switch checked={showFooter} onChange={handleFooterChange} />
                                </Form.Item>
                                <Form.Item label="Флажки">
                                    <Switch checked={!!rowSelection} onChange={handleRowSelectionChange} />
                                </Form.Item>
                                <Form.Item label="Фиксированный заголовок">
                                    <Switch checked={!!yScroll} onChange={handleYScrollChange} />
                                </Form.Item>
                                <Form.Item label="Имеет данные">
                                    <Switch checked={!!hasData} onChange={handleDataChange} />
                                </Form.Item>
                                <Form.Item label="Эллипсис">
                                    <Switch checked={!!ellipsis} onChange={handleEllipsisChange} />
                                </Form.Item>

                            </Form>
                        </Sider>
                    </Layout>
                </Layout>
            </div>


        </div>

)
    ;
};

export default MainSection;
