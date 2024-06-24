import axios from 'axios';

export const createAgent = async (title, city_id) => {
    try {
        // Fetch the existing agents
        const result = await fetchAgents();

        // Check if the result is an object with a 'data' property
        let existingCurrencies = [];
        if (result && Array.isArray(result.data)) {
            existingCurrencies = result.data;
        } else {
            console.error('Unexpected response format from fetchAgents:', result);
            throw new Error('Unexpected data format');
        }

        // Determine the highest code from the existing currencies
        const highestCode = existingCurrencies.reduce((max, currency) => {
            const currencyCode = parseInt(currency.code, 10); // Преобразуем код в число с основанием 10
            return currencyCode > max ? currencyCode : max;
        }, 0);

        const newCode = highestCode + 1;

        // Create the new currency with the auto-incremented code
        const response = await axios.post('https://devapi.istamgroup.com/api/agents', {
            title: title,
            city_id: city_id,
            code: newCode
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



export const fetchAgents = async (page, pageSize) => {
    try {
        const response = await fetch(`https://devapi.istamgroup.com/api/agents?page=${page}&per_page=${pageSize}`);
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


export const deleteAgent = async (id) => {
    try {
        const response = await axios.delete(`https://devapi.istamgroup.com/api/agents/${id}`);

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




export const updateAgent = async (id, title, city_id, code) => {
    try {
        const response = await axios.put(`https://devapi.istamgroup.com/api/agents/${id}`, {
            title: title,
            city_id: city_id,
            code: code,
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
