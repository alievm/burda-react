import axios from 'axios';

export const createSubEntity = async (title, expendable_entity_id, desc) => {
    try {
        // Create the new currency with the auto-incremented code
        const response = await axios.post('https://devapi.istamgroup.com/api/sub_expendable_entities', {
            title: title,
            expendable_entity_id: expendable_entity_id,
            desc: desc
        });

        if (response.status === 200) {
            console.log('Currency created successfully:', response.data);
            return response.data; // Return the created currency's data
        } else {
            console.error('Failed to create currency:', response.statusText);
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.error('Error creating currency:', error);
        throw error;
    }
};



export const fetchSubEntity = async (page, pageSize) => {
    try {
        const response = await fetch(`https://devapi.istamgroup.com/api/sub_expendable_entities?page=${page}&per_page=${pageSize}`);
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


export const deleteSubEntity = async (id) => {
    try {
        const response = await axios.delete(`https://devapi.istamgroup.com/api/sub_expendable_entities/${id}`);

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




export const updateSubEntity = async (id, title, expendable_entity_id, desc) => {
    try {
        const response = await axios.put(`https://devapi.istamgroup.com/api/sub_expendable_entities/${id}`, {
            title: title,
            expendable_entity_id: expendable_entity_id,
            desc: desc,
        });

        if (response.status === 200) {
            console.log('Agent updated successfully:', response.data);
            return response.data;
        } else {
            console.error('Failed to update agent:', response.statusText);
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.error('Error updating agent:', error);
        throw error;
    }
};
