import React, { useEffect, useState } from 'react';
import {Button, Dropdown, Input, Layout, Modal, notification, Select, Space, Table} from 'antd';
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
import {siderStyle} from "../../../../components/layoutStyles.js";
import {fetchAgents, deleteAgent, updateAgent, createAgent} from "../../../../service/finance/agentService.js";
import {fetchAllCities, updateCity} from "../../../../service/finance/cityService.js";

const { Content, Sider } = Layout;

const Agent = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [modalData, setModalData] = useState({
        id: null,
        city_id: '',  // Initialize with empty string or null
        title: '',    // Initialize with empty string or null
        code: '',
    });
    const [mainCategories, setMainCategories] = useState([]);

    useEffect(() => {
        fetchMainData();
        fetchMainCategoriesData();
    }, []);

    const fetchMainData = async () => {
        setLoading(true);
        try {
            const result = await fetchAgents(1  , 10); // Пример запроса на первую страницу с 10 записями
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
            const categories = await fetchAllCities();
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
            city_id: '',
            code: '',
            title: '',
        });
    };

    const handleCreate = async () => {
        try {
            const { city_id, title } = modalData;
            const createdData = await createAgent(title, city_id);
            setDataSource([createdData, ...dataSource]);
            fetchMainData();
            setModalVisible(false);
            notification.success({
                message: 'Успех',
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
            city_id: record.city_id,
            title: record.title,
            code: record.code
        });
        setModalVisible(true);
    };

    const handleUpdate = async () => {
        try {
            const { id, title, city_id, code } = modalData;
            const updatedData = await updateAgent(id, title, city_id, code);
            const updatedIndex = dataSource.findIndex(item => item.id === updatedData.id);
            if (updatedIndex !== -1) {
                const newData = [...dataSource];
                newData[updatedIndex] = updatedData;
                setDataSource(newData);
            }
            setModalMode('add');
            fetchMainData();
            setModalData({
                id: null,
                city_id: '',
                code: '',
                title: '',
            });

            setModalVisible(false);
            notification.success({
                message: 'Успех',
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
            await deleteAgent(id);
            setDataSource(dataSource.filter(item => item.id !== id));
            notification.success({
                message: 'Успех',
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
            title: 'Город',
            dataIndex: 'city_id',
            key: 'city_id',
            render: (city_id) => {
                const category = mainCategories.find(cat => cat.value === city_id);
                return category ? category.label : 'Неизвестно';
            },
        },
        {
            title: 'Код',
            dataIndex: 'code',
            key: 'code',
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
                    <Button className="flex items-center" icon={<MdDeleteSweep size="20"/>} onClick={() => handleDelete(record.id)}  style={{ marginLeft: 8 }}>Удалить</Button>
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
                                Субъект
                            </div>
                            <div className="mt-1 text-sm leading-5 text-ellipsis text-slate-600 max-md:max-w-full">
                                Таблица данных
                            </div>
                        </div>
                        <Button type="primary" onClick={() => setModalVisible(true)}>Добавить Субъект</Button>
                        <Modal
                            centered
                            title={modalMode === 'add' ? 'Добавить новый Субъект' : 'Редактировать Субъект'}
                            visible={modalVisible}
                            onOk={modalMode === 'add' ? handleCreate : handleUpdate}
                            onCancel={handleModalCancel}
                            okText={modalMode === 'add' ? 'Добавить' : 'Сохранить'}
                            cancelText="Отмена"
                        >
                            <Select
                                placeholder="Выберите город"
                                style={{ width: '100%', marginBottom: 16 }}
                                value={modalData.city_id}
                                onChange={(value) => setModalData({ ...modalData, city_id: value })}
                            >
                                {mainCategories.map(category => (
                                    <Select.Option key={category.value} value={category.value}>
                                        {category.label}
                                    </Select.Option>
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

export default Agent;
