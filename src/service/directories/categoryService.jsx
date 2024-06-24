import axios from "axios";

export const fetchCategories = async () => {
    try {
        const response = await axios.get('https://devapi.istamgroup.com/api/categories');
        if (response.status === 200) {
            return response.data.data.data; // Return only the 'data' array from the response
        } else {
            throw new Error(`Failed to fetch main categories: ${response.statusText}`);
        }
    } catch (error) {
        throw new Error(`Error fetching main categories: ${error.message}`);
    }
};

export const fetchAllCategories = async () => {
    try {
        const response = await fetch('https://devapi.istamgroup.com/api/category/all');
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


export const createCategory = async (rowData) => {
    try {
        const response = await axios.post('https://devapi.istamgroup.com/api/categories', {
            main_category_id: rowData.main_category_id,
            name_id: rowData.name_id,
            title: rowData.title,
        });
        return response.data; // Возвращаем данные ответа, если нужно
    } catch (error) {
        console.error('Error while sending data:', error);
        throw new Error('Failed to send data'); // Обработка ошибки, если нужно
    }
};


export const updateCategory = async (categoryId, updatedData) => {
    try {
        const response = await axios.put(`https://devapi.istamgroup.com/api/categories/${categoryId}`, {
            main_category_id: updatedData.main_category_id,
            name_id: updatedData.name_id,
            title: updatedData.title,
        });
        return response.data; // Return data from the response if needed
    } catch (error) {
        console.error('Error while updating category:', error);
        throw new Error('Failed to update category'); // Handle error as needed
    }
    };

export const deleteCategory = async (categoryId) => {
    try {
        const response = await axios.delete(`https://devapi.istamgroup.com/api/categories/${categoryId}`);
        return response.data; // Return data from the response if needed
    } catch (error) {
        console.error('Error while deleting category:', error);
        throw new Error('Failed to delete category'); // Handle error as needed
    }
};

