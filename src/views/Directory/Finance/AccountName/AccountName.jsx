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
    notification, Spin
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
import {MdDeleteSweep} from "react-icons/md";
import {Content, Footer} from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import {contentStyle, footerStyle, headerStyle, layoutStyle, siderStyle} from "../../../../components/layoutStyles.js";
import {CurrencyCard} from "../../../Dashboard/components/CurrencyCard.jsx";
import {BsThreeDotsVertical} from "react-icons/bs";
import {currencyData} from "../../../../utils/currencyData.js";
import ColumnSearch from "../../../../components/ColumnSearch.jsx";
import {
    createDensity,
    deleteDensity,
    fetchDensities,
    updateDensity
} from "../../../../service/directories/densityService.js";
import {createSeason, fetchSeasons, updateSeason, deleteSeason} from "../../../../service/directories/seasonService.js";
import TextArea from "antd/es/input/TextArea.js";
import {
    createCurrency,
    fetchCurrencies,
    deleteCurrency,
    updateCurrency
} from "../../../../service/finance/currencyService.js";
import {
    createAccountName,
    fetchAccountName,
    updateAccountName
} from "../../../../service/finance/accountNameService.js";

const AccountName = () => {
    const [dataSource, setDataSource] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [newCategoryTitle, setNewCategoryTitle] = useState('');
    const [newCategoryDesc, setNewCategoryDesc] = useState('');
    const [editCategoryTitle, setEditCategoryTitle] = useState('');
    const [editCategoryDesc, setEditCategoryDesc] = useState('');
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading indicator

    useEffect(() => {
        fetchMainCategoriesData();
    }, []);

    const fetchMainCategoriesData = async () => {
        setLoading(true); // Set loading to true when fetching starts
        try {
            const response = await fetchAccountName(); // Assuming fetchSeasons fetches the data from the API

            // Check if the response is directly an array
            if (Array.isArray(response)) {
                // Map over the categories array to format it as needed
                const formattedCategories = response.map((category) => ({
                    key: category.id.toString(),
                    title: category.title,
                    code: category.code,
                    created_at: category.created_at,
                    updated_at: category.updated_at
                }));

                // Update the state with the formatted categories
                setDataSource(formattedCategories);
            } else {
                console.error('Error: Expected an array of categories, got:', response);
                // Optionally, you can display a notification or set an error state here
                notification.error({
                    message: 'Ошибка',
                    description: 'Не удалось загрузить список категорий. Пожалуйста, попробуйте еще раз позже.',
                });
            }
        } catch (error) {
            console.error('Error fetching main categories:', error.message);
            // Optionally, you can display a notification or set an error state here
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось загрузить список категорий. Пожалуйста, попробуйте еще раз позже.',
            });
        } finally {
            setLoading(false); // Set loading to false when fetching is complete
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
            title: 'Валюта',
            dataIndex: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            sortDirections: ['ascend', 'descend'],
            ...titleColumnSearchProps

        },
        {
            title: 'Код',
            dataIndex: 'code',
            sorter: (a, b) => a.code.localeCompare(b.code),
            sortDirections: ['ascend', 'descend'],
            ...titleColumnSearchProps

        },
        {
            title: 'Действия',
            dataIndex: 'actions',
            render: (text, record) => (
                <Space size="small">
                    <Button className="flex items-center" icon={<FaPencilAlt/>} type="primary" size="middle" onClick={() => handleEdit(record)}>Изменить</Button>
                    <Button type="default" className="flex items-center" icon={<MdDeleteSweep size="20"/>} size="middle" onClick={() => handleDeleteCategory(record.key)}>Удалить</Button>
                </Space>
            ),
        },
    ];

    const handleEdit = (record) => {
        setEditCategoryId(record.key);
        setEditCategoryTitle(record.title);
        setEditCategoryDesc(record.code);
        setIsModalVisible(true);
    };

    const handleCreateCategory = () => {
        setNewCategoryTitle('');
        setNewCategoryDesc('');
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
            const updatedCategory = await updateAccountName(editCategoryId, editCategoryTitle, editCategoryDesc);

            setDataSource(prevState => {
                const updatedIndex = prevState.findIndex(item => item.key === updatedCategory.id);
                if (updatedIndex !== -1) {
                    prevState[updatedIndex] = {
                        ...prevState[updatedIndex],
                        title: updatedCategory.title,
                        code: updatedCategory.code,
                        updated_at: updatedCategory.updated_at,
                    };
                }
                return [...prevState];
            });

            fetchMainCategoriesData();
            setIsModalVisible(false);

            notification.success({
                message: 'Success',
                description: 'Category updated successfully!',
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
            // Create the new currency
            const newCurrency = await createAccountName(newCategoryTitle);

            // Update the state with the new currency
            setDataSource(prevState => [
                {
                    key: newCurrency.id,
                    title: newCurrency.title,
                    code: newCurrency.code,
                    created_at: newCurrency.created_at,
                    updated_at: newCurrency.updated_at,
                },
                ...prevState,
            ]);

            // Optionally fetch all main categories again
            fetchMainCategoriesData();
            setIsModalVisible(false);

            notification.success({
                message: 'Success',
                description: 'New category created successfully!',
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
            const success = await deleteAccountName(categoryId);

            if (success) {
                // Обновляем dataSource, удаляя категорию
                setDataSource(prevState => prevState.filter(item => item.key !== categoryId));

                // Уведомляем пользователя об успешном удалении категории
                notification.success({
                    message: 'Success',
                    description: 'Category deleted successfully!',
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
                                Название номера счета
                            </div>
                            <div className="mt-1 text-sm leading-5 text-ellipsis text-slate-600 max-md:max-w-full">
                                Таблица данных
                            </div>
                        </div>
                        <Button type="primary" onClick={handleCreateCategory}>
                            Создать новый сезон
                        </Button>

                        <Modal
                            centered
                            title={editCategoryId ? 'Изменить сезон' : 'Добавить новый сезон'}
                            visible={isModalVisible}
                            onOk={editCategoryId ? handleUpdateCategory : handleCreateNewCategory}
                            onCancel={() => setIsModalVisible(false)}
                            okText={editCategoryId ? 'Сохранить' : 'Добавить'}
                            cancelText="Отмена"
                        >
                            <Input
                                placeholder="Введите название сезона"
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
                                        loading={{ indicator: <div><Spin /></div>, spinning:!dataSource}}
                                        rowKey="key"
                                        components={{
                                            body: {
                                                row: Row,
                                            },
                                        }}
                                        columns={columns}
                                        dataSource={dataSource}
                                    />
                                </SortableContext>
                            </DndContext>
                        </Content>
                        <Sider width="28%" style={siderStyle}>
                            Sider
                        </Sider>
                    </Layout>
                </Layout>
            </div>


        </div>

    )
        ;
};

export default AccountName;
