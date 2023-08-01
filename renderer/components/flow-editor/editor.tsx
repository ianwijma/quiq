import ReactFlow, {
    addEdge,
    Controls,
    Edge,
    MiniMap,
    Node,
    Position,
    updateEdge,
    useEdgesState,
    useNodesState
} from "reactflow";
import {useCallback, useRef, useState} from "react";
import 'reactflow/dist/base.css'
import TriggerNode, {triggerNodeType} from "./Nodes/TriggerNode";
import FlexNode, {flexNodeType} from "./Nodes/FlexNode";

const triggerNode: Node = {
    id: 'trigger-node',
    dragHandle: 'immovable',
    position: { x: 0, y: 0 },
    data: { label: 'Flow Name Here' },
    type: 'trigger',
};

const initialNodes: Node[] = [
    {
        id: 'node-uuid-1',
        position: { x: 300, y: 0 },
        data: { label: 'first' },
        type: 'flex',
    },
    {
        id: 'node-uuid-2',
        data: { label: 'second' },
        position: { x: 600, y: 0 },
        type: 'flex',
    },
];

const triggerEdge: Edge = {
    id: 'trigger-edge',
    target: 'node-uuid-1',
    targetHandle: '0',
    source: 'trigger-node',
};
const initialEdges: Edge[] = [{
    id: 'edge-uuid-3',
    target: 'node-uuid-2',
    targetHandle: '0',
    source: 'node-uuid-1',
    sourceHandle: '0',
}];

const nodeTypes = {
    [triggerNodeType]: TriggerNode,
    [flexNodeType]: FlexNode,
}

export default () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([triggerNode, ...initialNodes]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([triggerEdge, ...initialEdges]);
    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
    // Drag and drop
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    // Disconnect edge on drop
    const edgeUpdateSuccessful = useRef(true);

    const onEdgeUpdateStart = useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, []);

    const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
        edgeUpdateSuccessful.current = true;
        setEdges((els) => updateEdge(oldEdge, newConnection, els));
    }, []);

    const onEdgeUpdateEnd = useCallback((_, edge) => {
        if (!edgeUpdateSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }

        edgeUpdateSuccessful.current = true;
    }, []);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    let id = 0;
    const getId = () => `dndnode_${id++}`;


    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const newNodeDataString = event.dataTransfer.getData('application/reactflow');
            const newNodeData: Partial<Node> = JSON.parse(newNodeDataString);

            console.log(newNodeData)

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            const newNode = {
                id: getId(),
                position,
                data: { label: `${newNodeData.type} node` },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                ...newNodeData
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );

    return <div className='grow bg-gray-200' ref={reactFlowWrapper}>
        <ReactFlow
            // Handle events
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            // Disconnect edge on drop
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            // Drag and drop
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            // Configuration
            snapToGrid
            fitView
            nodeTypes={nodeTypes}
        >
            <MiniMap />
            <Controls />
        </ReactFlow>
    </div>
}
