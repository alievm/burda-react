import axios from 'axios';

export const createAccountName = async (title) => {
    try {
        // Fetch the existing currencies to determine the highest current code
        const existingCurrencies = await fetchAccountName();

        // Determine the highest code from the existing currencies
        const highestCode = existingCurrencies.reduce((max, currency) => {
            const currencyCode = parseInt(currency.code); // Преобразуем код в число
            return currencyCode > max ? currencyCode : max;
        }, 0);

        // Calculate the new code as the highest code + 1
        const newCode = highestCode + 1;

        // Create the new currency with the auto-incremented code
        const response = await axios.post('https://devapi.istamgroup.com/api/invoice_names', {
            title: title,
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


export const fetchAccountName = async () => {
    try {
        const response = await axios.get('https://devapi.istamgroup.com/api/invoice_names');
        if (response.status === 200) {
            return response.data.data.data; // Return only the 'data' array from the response
        } else {
            throw new Error(`Failed to fetch main categories: ${response.statusText}`);
        }
    } catch (error) {
        throw new Error(`Error fetching main categories: ${error.message}`);
    }
};


export const deleteAccountName = async (id) => {
    try {
        const response = await axios.delete(`https://devapi.istamgroup.com/api/invoice_names/${id}`);

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




export const updateAccountName = async (id, newTitle, code) => {
    try {
        const response = await axios.put(`https://devapi.istamgroup.com/api/invoice_names/${id}`, {
            title: newTitle,
            code: code
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
