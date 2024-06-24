import React from 'react';
import { Form, Input, InputNumber } from 'antd';

const EditableCell = ({
                          editing,
                          dataIndex,
                          title, // Ensure 'title' is received as a prop
                          inputType,
                          record,
                          index,
                          children,
                          ...restProps
                      }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing && dataIndex !== 'operation' ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                    initialValue={record[dataIndex]} // Set initial value from record
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default EditableCell;
