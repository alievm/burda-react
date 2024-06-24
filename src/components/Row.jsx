// Row.jsx
import React, { useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from 'antd';
import { RowContext } from './RowContext';

const Row = (props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: props['data-row-key'],
    });

    const style = {
        ...props.style,
        transform: CSS.Translate.toString(transform),
        transition,
        ...(isDragging
            ? {
                position: 'relative',
                zIndex: 9999,
            }
            : {}),
    };

    const contextValue = useMemo(
        () => ({
            setActivatorNodeRef,
            listeners,
        }),
        [setActivatorNodeRef, listeners],
    );

    return (
        <RowContext.Provider value={contextValue}>
            <tr {...props} ref={setNodeRef} style={style} {...attributes} />
        </RowContext.Provider>
    );
};

export default Row;
