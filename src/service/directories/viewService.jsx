import axios from "axios";

export const fetchViews = async () => {
    try {
        const response = await axios.get('https://devapi.istamgroup.com/api/views');
        if (response.status === 200) {
            return response.data.data.data;
        } else {
            throw new Error(`Failed to fetch main categories: ${response.statusText}`);
        }
    } catch (error) {
        throw new Error(`Error fetching main categories: ${error.message}`);
    }
};

export const createView = async (rowData) => {
    try {
        const response = await axios.post('https://devapi.istamgroup.com/api/views', {
            main_category_id: rowData.main_category_id,
            category_id: rowData.category_id,
            name_id: rowData.name_id,
            title: rowData.title,
        });
        return response.data;
    } catch (error) {
        console.error('Error while sending data:', error);
        throw new Error('Failed to send data');
    }
};

export const updateView = async (viewId, updatedData) => {
    try {
        const response = await axios.put(`https://devapi.istamgroup.com/api/views/${viewId}`, {
            main_category_id: updatedData.main_category_id,
            category_id: updatedData.category_id,
            name_id: updatedData.name_id,
            title: updatedData.title,
        });
        return response.data; // Return data from the response if needed
    } catch (error) {
        console.error('Error while updating category:', error);
        throw new Error('Failed to update category'); // Handle error as needed
    }
};

export const deleteView = async (viewId) => {
    try {
        const response = await axios.delete(`https://devapi.istamgroup.com/api/views/${viewId}`);
        return response.data; // Return data from the response if needed
    } catch (error) {
        console.error('Error while deleting category:', error);
        throw new Error('Failed to delete category'); // Handle error as needed
    }
};


