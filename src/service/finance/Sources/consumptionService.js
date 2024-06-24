import axios from 'axios';

export const fetchExpendableEntities = async () => {
    try {
        const response = await axios.get('https://devapi.istamgroup.com/api/expendable_entities');

        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error(`Failed to fetch expendable entities: ${response.statusText}`);
        }
    } catch (error) {
        throw new Error(`Error fetching expendable entities: ${error.message}`);
    }
};

export const fetchAllEntities = async () => {
    try {
        const response = await fetch('https://devapi.istamgroup.com/api/expendable_entity/all');
        const result = await response.json();

        console.log('API Response:', response); // Log the response
        console.log('Parsed Result:', result); // Log the parsed JSON result

        // Check if the response is valid
        if (result.status && result.data && Array.isArray(result.data)) {
            return result.data.map((entity) => ({
                label: entity.title,
                value: entity.id
            }));
        } else {
            throw new Error('Failed to fetch entities or invalid response structure');
        }
    } catch (error) {
        console.error('Error fetching entities:', error);
        throw error;
    }
};

export const createExpendableEntity = async (title, desc, categories) => {
    try {
        const response = await axios.post('https://devapi.istamgroup.com/api/expendable_entities', {
            title: title,
            desc: desc,
            categories: categories // Assuming categories is an array of objects with id and name
        });

        if (response.status === 200) {
            console.log('Expendable entity created successfully:', response.data);
            return response.data.data; // Return the created entity's data
        } else {
            console.error('Failed to create expendable entity:', response.statusText);
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.error('Error creating expendable entity:', error);
        throw error;
    }
};



export const updateExpendableEntity = async (id, newTitle, desc, categories) => {
    try {
        const response = await axios.put(`https://devapi.istamgroup.com/api/expendable_entities/${id}`, {
            title: newTitle,
            desc: desc,
            categories: categories
        });

        if (response.status === 200) {
            console.log('Expendable entity updated successfully:', response.data);
            return response.data.data; // Return updated entity data
        } else {
            console.error('Failed to update expendable entity:', response.statusText);
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.error('Error updating expendable entity:', error);
        throw error;
    }
};


export const deleteExpendableEntity = async (id) => {
    try {
        const response = await axios.delete(`https://devapi.istamgroup.com/api/expendable_entities/${id}`);

        if (response.status === 200) {
            console.log('Expendable entity deleted successfully');
            return true; // Return true upon successful deletion
        } else {
            console.error('Failed to delete expendable entity:', response.statusText);
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.error('Error deleting expendable entity:', error);
        throw error;
    }
};
