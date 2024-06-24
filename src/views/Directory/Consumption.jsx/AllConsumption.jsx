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
    notification, Spin, Tag, Select
} from 'antd';
import DragHandle from "../../../components/DragHandle.jsx";
import Row from "../../../components/Row.jsx";
const { Search } = Input;
import {FaPencilAlt} from "react-icons/fa";
import {MdDeleteSweep} from "react-icons/md";
import {Content, Footer} from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import {contentStyle, footerStyle, headerStyle, layoutStyle, siderStyle} from "../../../components/layoutStyles.js";
import {CurrencyCard} from "../../Dashboard/components/CurrencyCard.jsx";
import {BsThreeDotsVertical} from "react-icons/bs";
import {currencyData} from "../../../utils/currencyData.js";
import ColumnSearch from "../../../components/ColumnSearch.jsx";
import {createSeason, fetchSeasons, updateSeason, deleteSeason} from "../../../service/directories/seasonService.js";
import TextArea from "antd/es/input/TextArea.js";
import {
    createExpendableEntity, deleteExpendableEntity,
    fetchExpendableEntities,
    updateExpendableEntity
} from "../../../service/finance/Sources/consumptionService.js";

const AllConsumption = () => {
    const [dataSource, setDataSource] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [newCategoryTitle, setNewCategoryTitle] = useState('');
    const [newCategoryDesc, setNewCategoryDesc] = useState('');
    const [categoriesArray, setCategoriesArray] = useState([]);
    const [editCategoryCategories, setEditCategoryCategories] = useState([]);
    const [newCategoryCategories, setNewCategoryCategories] = useState([]);
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
            const response = await fetchExpendableEntities();

            // Check if response is defined and has data property
            if (response && Array.isArray(response.data)) {
                const formattedCategories = response.data.map((entity) => ({
                    key: entity.id.toString(),
                    title: entity.title,
                    desc: entity.desc,
                    created_at: entity.created_at,
                    updated_at: entity.updated_at,
                    categories: entity.categories.map((category) => ({
                        id: category.id,
                        name: category.name
                    }))
                }));

                // Update the state with the formatted categories
                setDataSource(formattedCategories);
            } else {
                console.error('Error: Expected a valid response object, got:', response);
                // Handle case where response is not as expected
                notification.error({
                    message: 'Ошибка',
                    description: 'Не удалось загрузить список категорий. Пожалуйста, попробуйте еще раз позже.',
                });
            }
        } catch (error) {
            console.error('Error fetching main categories:', error.message);
            // Handle error from fetchExpendableEntities
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
            title: 'Наименование',
            dataIndex: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            sortDirections: ['ascend', 'descend'],
            ...titleColumnSearchProps

        },
        {
            title: 'Описание',
            dataIndex: 'desc',
            sorter: (a, b) => a.desc.localeCompare(b.desc),
            sortDirections: ['ascend', 'descend'],
            ...titleColumnSearchProps

        },
        {
            title: 'Категории',
            dataIndex: 'categories',
            render: (categories) => (
                <>
                    {categories.map((category) => (
                        <Tag color="#108ee9" key={category.id}>{category.name}</Tag>
                    ))}
                </>
            ),
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
        setEditCategoryDesc(record.desc);
        setEditCategoryCategories(record.categories.map(category => category.name)); // Populate edit tags
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
            const formattedCategories = editCategoryCategories.map(name => ({
                id: `temp-id-${Math.random().toString().substring(2)}`,
                name
            }));

            const updatedEntity = await updateExpendableEntity(editCategoryId, editCategoryTitle, editCategoryDesc, formattedCategories);

            setDataSource(prevState => {
                const updatedIndex = prevState.findIndex(item => item.key === updatedEntity.id);
                if (updatedIndex !== -1) {
                    prevState[updatedIndex] = {
                        ...prevState[updatedIndex],
                        title: updatedEntity.title,
                        desc: updatedEntity.desc,
                        updated_at: updatedEntity.updated_at,
                        categories: updatedEntity.categories.map(category => ({
                            id: category.id,
                            name: category.name
                        }))
                    };
                }
                return [...prevState];
            });

            fetchMainCategoriesData();
            setIsModalVisible(false);

            notification.success({
                message: 'Success',
                description: 'Категория успешно обновлена!',
            });
        } catch (error) {
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось обновить категорию. Пожалуйста, попробуйте еще раз позже.',
            });
            console.error('Error updating category:', error);
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
            const formattedCategories = newCategoryCategories.map(name => ({
                id: `temp-id-${Math.random().toString().substring(2)}`,
                name
            }));

            const newEntity = await createExpendableEntity(newCategoryTitle, newCategoryDesc, formattedCategories);

            setDataSource(prevState => [
                {
                    key: newEntity.id,
                    title: newEntity.title,
                    desc: newEntity.desc,
                    created_at: newEntity.created_at,
                    updated_at: newEntity.updated_at,
                    categories: newEntity.categories.map(category => ({
                        id: category.id,
                        name: category.name
                    }))
                },
                ...prevState,
            ]);

            fetchMainCategoriesData();
            setIsModalVisible(false);

            notification.success({
                message: 'Success',
                description: 'Новая категория создана успешно!',
            });
        } catch (error) {
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось создать категорию. Пожалуйста, попробуйте еще раз позже.',
            });
            console.error('Error creating category:', error);
        }
    };



    const handleDeleteCategory = async (categoryId) => {
        try {
            const success = await deleteExpendableEntity(categoryId);

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
                                Создать субъект
                            </div>
                            <div className="mt-1 text-sm leading-5 text-ellipsis text-slate-600 max-md:max-w-full">
                                Таблица данных
                            </div>
                        </div>
                        <Button type="primary" onClick={handleCreateCategory}>
                            Создать новый субъект
                        </Button>

                        <Modal
                            centered
                            title={editCategoryId ? 'Изменить субъект' : 'Добавить новый субъект'}
                            visible={isModalVisible}
                            onOk={editCategoryId ? handleUpdateCategory : handleCreateNewCategory}
                            onCancel={() => setIsModalVisible(false)}
                            okText={editCategoryId ? 'Сохранить' : 'Добавить'}
                            cancelText="Отмена"
                        >
                            <Select
                                mode="tags"
                                style={{ width: '100%', marginTop: 10 }}
                                placeholder="Введите субъект"
                                value={editCategoryId ? editCategoryCategories : newCategoryCategories}
                                onChange={value => editCategoryId ? setEditCategoryCategories(value) : setNewCategoryCategories(value)}
                            />
                            <Input
                                className=' mt-5'
                                placeholder="Введите название субъект"
                                value={editCategoryId ? editCategoryTitle : newCategoryTitle}
                                onChange={(e) => editCategoryId ? setEditCategoryTitle(e.target.value) : setNewCategoryTitle(e.target.value)}
                            />

                            <TextArea
                                className=' mt-5 mb-10'
                                showCount
                                maxLength={100}
                                value={editCategoryId ? editCategoryDesc : newCategoryDesc}
                                onChange={(e) => editCategoryId ? setEditCategoryDesc(e.target.value) : setNewCategoryDesc(e.target.value)}
                                placeholder="Описание"
                                style={{
                                    height: 120,
                                    resize: 'none',
                                }}
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

export default AllConsumption;
