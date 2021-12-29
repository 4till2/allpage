//SOURCE: https://codesandbox.io/s/react-drag-and-drop-react-beautiful-dnd-forked-5fg8i
import React, {useEffect, useState} from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import Block from "./block";

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export default function Sortable({blocksState, setBlocksState, commitBlockPosition}) {
    //https://github.com/atlassian/react-beautiful-dnd/issues/1756#issuecomment-735369084
    const [winReady, setwinReady] = useState(false);
    useEffect(() => {
        setwinReady(true);
    }, []);
    if (!winReady) return <></>

    function onDragEnd(result) {
        const {source, destination, draggableId} = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const items = reorder(blocksState, source.index, destination.index);
        setBlocksState(items)
        commitBlockPosition(draggableId, destination.index)
    }

    return (
        <div>
            <div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={"droppable"}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {blocksState.map((block, index) => (
                                    <Draggable
                                        key={block.id}
                                        draggableId={block.id}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`rounded ${snapshot.isDragging ? '' : ''}`}
                                            >
                                                <div className={"inline-flex w-full z-0"}>
                                                    <Block
                                                        block={block}
                                                        key={block.id}
                                                        className={"w-full"}
                                                        authorMode={true}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
}

