import { GridStack } from 'gridstack';
import {useEffect, useState} from "react";

export default function Playground() {
    // _________________________________________________
    // Initialize Gridstack inside useEffect so that DOM is rendered when its initialized
    // _________________________________________________
    const [grid, setGrid] = useState(null)
    useEffect(() => {
        setGrid(GridStack.init());
        console.log(grid)
        grid && grid.on("dragstop", (event, element) => {
            const node = element.gridstackNode;
            console.log({
                info: `you just dragged node #${node.id} to ${node.x},${node.y} – good job!`,
            });

        });
    })

    return (
        <div className="">
            <div className="grid-stack">
                <div className="grid-stack-item border-dark" data-gs-width="4" data-gs-height="4">
                    <div className="grid-stack-item-content">Item 1</div>
                </div>
                <div className="grid-stack-item border-dark" data-gs-width="4" data-gs-height="4">
                    <div className="grid-stack-item-content">Item 2</div>
                </div>
                <div className="grid-stack-item border-dark" data-gs-width="4" data-gs-height="4">
                    <div className="grid-stack-item-content">Item 3</div>
                </div>
            </div>
        </div>
    );
}
