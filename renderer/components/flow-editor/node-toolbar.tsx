import { Node } from 'reactflow';
import FlexNode, {flexNodeDefaultData, flexNodeType} from "./nodes/FlexNode";

export default () => {
    const onDragStart = (event, node: Partial<Node>) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(node));
        event.dataTransfer.effectAllowed = 'move';
    };

    return <div className='flex gap-3 px-3 py-2 bg-gray-300'>
        <div className='cursor-grab' onDragStart={(event) => onDragStart(event, { type: flexNodeType, data: flexNodeDefaultData })} draggable>
            <div>
                <FlexNode className='pointer-events-none w-36' />
            </div>
        </div>
    </div>
}
