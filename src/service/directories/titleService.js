import axios from 'axios';

// Функция для отправки данных на сервер
export const createTitle = async (rowData) => {
    try {
        const response = await axios.post('https://devapi.istamgroup.com/api/names', {
            main_category_id: rowData.main_category_id,
            title: rowData.title,
        });
        return response.data; // Возвращаем данные ответа, если нужно
    } catch (error) {
        console.error('Error while sending data:', error);
        throw new Error('Failed to send data'); // Обработка ошибки, если нужно
    }
};

export const editNameById = async (id, newData) => {
    try {
        const response = await axios.put(`https://devapi.istamgroup.com/api/names/${id}`, newData);
        return response.data; // Assuming your API returns updated data
    } catch (error) {
        throw new Error(`Failed to edit name with id ${id}: ${error.message}`);
    }
};

export const deleteNameById = async (id) => {
    try {
        const response = await axios.delete(`https://devapi.istamgroup.com/api/names/${id}`);
        return response.data; // Возвращаем данные ответа при успешном удалении
    } catch (error) {
        console.error('Error deleting name:', error);
        throw error; // Пробрасываем ошибку дальше для обработки
    }
};

export const fetchMainCategories = async () => {
    try {
        const response = await fetch('https://devapi.istamgroup.com/api/main_categories');
        const result = await response.json();
        if (result.status) {
            return result.data.data.map((category) => ({
                label: category.title,
                value: category.id
            }));
        } else {
            throw new Error('Failed to fetch main categories');
        }
    } catch (error) {
        console.error('Ошибка при получении основных разделов:', error);
        throw error;
    }
};

export const fetchAllTitles = async () => {
    try {
        const response = await fetch('https://devapi.istamgroup.com/api/name/all');
        const result = await response.json();

        if (result.status && result.data && Array.isArray(result.data)) {
            return result.data.map((title) => ({
                label: title.title,
                value: title.id
            }));
        } else {
            throw new Error('Failed to fetch titles or invalid response structure');
        }
    } catch (error) {
        console.error('Ошибка при получении основных разделов:', error);
        throw error;
    }
};


export const fetchTitles = async (page, pageSize) => {
    try {
        const response = await fetch(`https://devapi.istamgroup.com/api/names?page=${page}&per_page=${pageSize}`);
        const result = await response.json();
        if (result.status) {
            return {
                data: result.data.data,
                total: result.data.total
            };
        } else {
            throw new Error('Failed to fetch titles');
        }
    } catch (error) {
        console.error('Ошибка при получении наименований:', error);
        throw error;
    }
};
