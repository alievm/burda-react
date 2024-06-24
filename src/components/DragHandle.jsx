// DragHandle.jsx
import React, { useContext } from 'react';
import { HolderOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { RowContext } from './RowContext';

const DragHandle = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);

    return (
        <Button
            type="text"
            size="small"
            icon={<HolderOutlined />}
            style={{
                cursor: 'move',
            }}
            ref={setActivatorNodeRef}
            {...listeners}
        />
    );
};

export default DragHandle;
