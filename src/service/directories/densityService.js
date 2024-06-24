import axios from 'axios';


export const fetchDensities = async () => {
    try {
        const response = await axios.get('https://devapi.istamgroup.com/api/densities');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching densities: ', error);
        throw error
    }
};

export const createDensity = async (title) => {
    try {
        const response = await axios.post('https://devapi.istamgroup.com/api/densities', {
            title: title,
        });
        return response.data; // Возвращаем данные созданной плотности или какой-то другой ответ сервера
    } catch (error) {
        console.error('Error creating density: ', error);
        throw error; // Пробрасываем ошибку дальше для обработки
    }
};



export const updateDensity = async (id, newTitle) => {
    try {
        const response = await axios.put(`https://devapi.istamgroup.com/api/densities/${id}`, {
            title: newTitle,
        });

        if (response.status === 200) {
            console.log('Main category updated successfully:', response.data);
            // Additional actions after successful update
            return response.data;
        } else {
            console.error('Failed to update main category:', response.statusText);
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.error('Error updating main category:', error);
        throw error;
    }
};


export const deleteDensity = async (id) => {
    try {
        const response = await axios.delete(`https://devapi.istamgroup.com/api/densities/${id}`);

        if (response.status === 200) {
            console.log('Main category deleted successfully');
            // Additional actions after successful deletion
            return true; // Return true or any other relevant data upon success
        } else {
            console.error('Failed to delete main category:', response.statusText);
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.error('Error deleting main category:', error);
        throw error;
    }
};
