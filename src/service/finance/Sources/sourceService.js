import axios from 'axios';

export const createSource= async (title, desc) => {
    try {
        const response = await axios.post('https://devapi.istamgroup.com/api/sources', {
            title: title,
            desc: desc
        });

        if (response.status === 200) {
            console.log('Main category created successfully:', response.data);
            return response.data; // Вернуть данные созданного элемента
        } else {
            console.error('Failed to create main category:', response.statusText);
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.error('Error creating main category:', error);
        throw error;
    }
};


export const fetchSource = async () => {
    try {
        const response = await axios.get('https://devapi.istamgroup.com/api/sources');
        if (response.status === 200) {
            return response.data.data.data; // Return only the 'data' array from the response
        } else {
            throw new Error(`Failed to fetch main categories: ${response.statusText}`);
        }
    } catch (error) {
        throw new Error(`Error fetching main categories: ${error.message}`);
    }
};

export const fetchAllSources = async () => {
    try {
        const response = await fetch('https://devapi.istamgroup.com/api/source/all');
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


export const deleteSource = async (id) => {
    try {
        const response = await axios.delete(`https://devapi.istamgroup.com/api/sources/${id}`);

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




export const updateSource = async (id, newTitle, desc) => {
    try {
        const response = await axios.put(`https://devapi.istamgroup.com/api/sources/${id}`, {
            title: newTitle,
            desc: desc
        });

        if (response.status === 200) {
            console.log('Main category updated successfully:', response.data);
            // Additional actions after successful update
            return response.data; // Return updated data or any relevant response
        } else {
            console.error('Failed to update main category:', response.statusText);
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.error('Error updating main category:', error);
        throw error;
    }
};
