import axios from 'axios';

export const createWarehouse = async (title, description) => {
    try {
        const response = await axios.post('https://devapi.istamgroup.com/api/workshops', {
            name: title,
            description: description
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


export const fetchWarehouse = async () => {
    try {
        const response = await axios.get('https://devapi.istamgroup.com/api/workshops');
        if (response.status === 200) {
            return response.data.data.data; // Return only the 'data' array from the response
        } else {
            throw new Error(`Failed to fetch main categories: ${response.statusText}`);
        }
    } catch (error) {
        throw new Error(`Error fetching main categories: ${error.message}`);
    }
};


export const deleteWarehouse = async (id) => {
    try {
        const response = await axios.delete(`https://devapi.istamgroup.com/api/workshops/${id}`);

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


export const updateWarehouse = async (id, newTitle, description) => {
    try {
        const response = await axios.put(`https://devapi.istamgroup.com/api/workshops/${id}`, {
            name: newTitle,
            description: description
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
