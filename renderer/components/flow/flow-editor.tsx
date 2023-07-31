import Flow from "../../../main/flow/flow";
import ReactFlow, {
    addEdge,
    Controls,
    Edge,
    MiniMap,
    Node,
    Position, ReactFlowProvider,
    updateEdge,
    useEdgesState,
    useNodesState
} from "reactflow";
import {useCallback, useEffect, useRef, useState} from "react";
import 'reactflow/dist/base.css'

const triggerNode: Node = {
    id: 'trigger-node',
    dragHandle: 'immovable',
    position: { x: 0, y: 0 },
    data: { label: 'Trigger' },
    type: 'input',
    sourcePosition: Position.Right
};

const initialNodes: Node[] = [
    {
        id: 'some-uuid-1',
        position: { x: 200, y: 0 },
        data: { label: 'first' },
        sourcePosition: Position.Right,
        targetPosition: Position.Left
    },
    {
        id: 'some-uuid-2',
        data: { label: 'second' },
        position: { x: 400, y: 0 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left
    },
];

const triggerEdge: Edge = { id: 'trigger-edge', source: 'trigger-node', target: initialNodes[0].id };
const initialEdges: Edge[] = [{ id: 'some-uuid-3', source: 'some-uuid-1', target: 'some-uuid-2' }];

export default ({flow, updateFlow}: {flow: Flow, updateFlow: (flow: Flow) => void}) => {
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

    let index = 0;
    useEffect(() => {
        // index++
        // console.log(`${index}:`);
        // console.log('nodes');
        // console.log(nodes);
        // console.log('edges');
        // console.log(edges);
    }, [nodes, edges]);

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

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
            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            const newNode = {
                id: getId(),
                type,
                position,
                data: { label: `${type} node` },
                sourcePosition: Position.Right,
                targetPosition: Position.Left
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );

    return <ReactFlowProvider>
        <div className='dndflow w-full h-full flex flex-col'>
            <aside className='flex gap-5'>
                <div className='dndnode input' onDragStart={(event) => onDragStart(event, 'default')} draggable>
                    Code
                </div>
            </aside>
            <div className='reactflow-wrapper grow' ref={reactFlowWrapper}>>
                <ReactFlow
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
                >
                    <MiniMap />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    </ReactFlowProvider>
}
