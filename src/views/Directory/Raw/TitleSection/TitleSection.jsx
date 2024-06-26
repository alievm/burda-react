import React, { useEffect, useState } from 'react';
import {Button, Dropdown, Input, Layout, Modal, notification, Popconfirm, Select, Space, Table} from 'antd';
import { createTitle, deleteNameById, editNameById, fetchTitles, fetchMainCategories } from "../../../../service/directories/titleService.js";
import { BsThreeDotsVertical } from "react-icons/bs";
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DragHandle from "../../../../components/DragHandle.jsx";
import Row from '../../../../components/Row.jsx'
import {FaPencilAlt} from "react-icons/fa";
import {MdDeleteSweep} from "react-icons/md";
import {currencyData} from "../../../../utils/currencyData.js";
import {CurrencyCard} from "../../../Dashboard/components/CurrencyCard.jsx";
import {siderStyle} from "../MainSection/components/layoutStyles.js";

const { Content, Sider } = Layout;

const TitleSection = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [modalData, setModalData] = useState({
        id: null,
        main_category_id: null,
        title: '',
    });
    const [mainCategories, setMainCategories] = useState([]);

    useEffect(() => {
        fetchMainData();
        fetchMainCategoriesData();
    }, []);

    const fetchMainData = async () => {
        setLoading(true);
        try {
            const result = await fetchTitles(1, 10); // Пример запроса на первую страницу с 10 записями
            setDataSource(result.data);
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

    const handleModalCancel = () => {
        setModalVisible(false);
        setModalMode('add');
        setModalData({
            id: null,
            main_category_id: null,
            title: '',
        });
    };

    const handleCreate = async () => {
        try {
            const newData = {
                main_category_id: modalData.main_category_id,
                title: modalData.title,
            };
            const createdData = await createTitle(newData);
            setDataSource([createdData, ...dataSource]);
            fetchMainData();
            setModalVisible(false);
            notification.success({
                message: 'Успешно создано',
                description: 'Новое наименование успешно создано!',
            });
        } catch (error) {
            console.error('Failed to create title:', error);
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось создать новое наименование. Пожалуйста, попробуйте еще раз позже.',
            });
        }
    };

    const handleEdit = (record) => {
        setModalMode('edit');
        setModalData({
            id: record.id,
            main_category_id: record.main_category_id,
            title: record.title,
        });
        setModalVisible(true);
    };

    const handleUpdate = async () => {
        try {
            const updatedData = await editNameById(modalData.id, {
                main_category_id: modalData.main_category_id,
                title: modalData.title,
            });
            const updatedIndex = dataSource.findIndex(item => item.id === updatedData.id);
            if (updatedIndex !== -1) {
                const newData = [...dataSource];
                newData[updatedIndex] = updatedData;
                setDataSource(newData);
            }
            setModalVisible(false);
            notification.success({
                message: 'Успешно изменено',
                description: 'Наименование успешно обновлено!',
            });
        } catch (error) {
            console.error('Failed to update title:', error);
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось обновить наименование. Пожалуйста, попробуйте еще раз позже.',
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteNameById(id);
            setDataSource(dataSource.filter(item => item.id !== id));
            notification.success({
                message: 'Успешно удалено!',
                description: 'Наименование успешно удалено!',
            });
        } catch (error) {
            console.error('Failed to delete title:', error);
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось удалить наименование. Пожалуйста, попробуйте еще раз позже.',
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
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (text, record) => (
                <Space size="small">
                    <Button className="flex items-center" icon={<FaPencilAlt/>} type="primary" onClick={() => handleEdit(record)}>Изменить</Button>
                    <Popconfirm title="Вы хотите удалить ?" onConfirm={() => handleDelete(record.id)}>
                        <Button type="default" className="flex items-center" icon={<MdDeleteSweep size="20"/>} size="middle" >Удалить</Button>
                    </Popconfirm>
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
                                Наименование
                            </div>
                            <div className="mt-1 text-sm leading-5 text-ellipsis text-slate-600 max-md:max-w-full">
                                Таблица данных
                            </div>
                        </div>
                        <Button type="primary" onClick={() => setModalVisible(true)}>Добавить наименование</Button>
                        <Modal
                            centered
                            title={modalMode === 'add' ? 'Добавить новое наименование' : 'Редактировать наименование'}
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
                            <Input
                                placeholder="Введите наименование"
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
                                            row: Row, // Ensure Row component is correctly defined
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

export default TitleSection;
