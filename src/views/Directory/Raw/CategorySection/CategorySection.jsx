import React, { useEffect, useState } from 'react';
import {Button, Dropdown, Input, Layout, Modal, notification, Select, Space, Table} from 'antd';
import { BsThreeDotsVertical } from "react-icons/bs";
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DragHandle from "../../../../components/DragHandle.jsx";
import Row from '../../../../components/Row.jsx'; // Ensure Row component is correctly defined
import {fetchCategories, createCategory, updateCategory, deleteCategory} from "../../../../service/directories/categoryService.jsx";
import {fetchAllTitles, fetchMainCategories, fetchTitles} from "../../../../service/directories/titleService.js";
import {FaPencilAlt} from "react-icons/fa";
import {MdDeleteSweep} from "react-icons/md";
import {siderStyle} from "../MainSection/components/layoutStyles.js";
import {currencyData} from "../../../../utils/currencyData.js";
import {CurrencyCard} from "../../../Dashboard/components/CurrencyCard.jsx";

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

    useEffect(() => {
        fetchMainData();
        fetchMainCategoriesData();
        fetchTitlesData();
    }, []);

    const fetchMainData = async () => {
        setLoading(true);
        try {
            const result = await fetchCategories();
            setDataSource(result);
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
        try {
            const newData = {
                main_category_id: modalData.main_category_id,
                name_id: modalData.name_id,
                title: modalData.title,
            };
            const createdData = await createCategory(newData);
            fetchMainData();
            setDataSource([createdData, ...dataSource]);
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
            setDataSource(dataSource.filter(item => item.id !== id));
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

    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id) {
            setDataSource((prevState) => {
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
                        <div className="text-xl title-section font-extrabold tracking-normal text-sky-900 max-md:max-w-full">
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
                            <div className="text-xl title-section font-extrabold tracking-normal text-sky-900 max-md:max-w-full">
                                Категории
                            </div>
                            <div className="mt-1 text-sm leading-5 text-ellipsis text-slate-600 max-md:max-w-full">
                                Таблица данных
                            </div>
                        </div>
                        <Button type="primary" onClick={() => setModalVisible(true)}>Добавить категорию</Button>
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
                                style={{ width: '100%', marginBottom: 16 }}
                                value={modalData.main_category_id}
                                onChange={(value) => setModalData({ ...modalData, main_category_id: value })}
                            >
                                {mainCategories.map(category => (
                                    <Select.Option key={category.value} value={category.value}>{category.label}</Select.Option>
                                ))}
                            </Select>
                            <Select
                                placeholder="Выберите наименование"
                                style={{ width: '100%', marginBottom: 16 }}
                                value={modalData.name_id}
                                onChange={(value) => setModalData({ ...modalData, name_id: value })}
                            >
                                {titlesData.map(title => (
                                    <Select.Option key={title.value} value={title.value}>{title.label}</Select.Option>
                                ))}
                            </Select>
                            <Input
                                placeholder="Введите название"
                                value={modalData.title}
                                onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                            />
                        </Modal>
                        <Dropdown placement="bottom" trigger={['click']}>
                            <Button type="text" onClick={(e) => e.preventDefault()}>
                                <BsThreeDotsVertical className="text-xl" />
                            </Button>
                        </Dropdown>
                    </div>
                    <div className="w-full bg-gray-200 min-h-[1px] max-md:max-w-full" />
                </div>
                <Layout>
                    <Content>
                        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                            <SortableContext items={dataSource.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                                <Table
                                    dataSource={dataSource}
                                    columns={columns}
                                    loading={loading}
                                    rowKey="id"
                                    components={{
                                        body: {
                                            row: Row,
                                        },
                                    }}
                                    pagination={{ pageSize: 10 }}
                                />
                            </SortableContext>
                        </DndContext>
                    </Content>
                    <Sider style={siderStyle} width="28%">
                        Sider
                    </Sider>
                </Layout>
            </div>
        </div>
    );
};

export default CategorySection;
