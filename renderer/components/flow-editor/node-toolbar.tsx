import { Node } from 'reactflow';

interface ToolbarNode {
    label: string,
    node: Partial<Node>
}

export default ({ toolbarNodes }: { toolbarNodes: ToolbarNode[] }) => {
    const onDragStart = (event, node: Partial<Node>) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(node));
        event.dataTransfer.effectAllowed = 'move';
    };

    return <div className='flow-editor-toolbar'>
        {toolbarNodes.map(toolbarNode => (
            <div key={toolbarNode.label} className='flow-editor-toolbar__node' onDragStart={(event) => onDragStart(event, toolbarNode.node)} draggable>
                {toolbarNode.label}
            </div>
        ))}
    </div>
}
