import ReactFlow, {
    addEdge,
    Controls, Edge,
    MiniMap,
    Node,
    Position,
    updateEdge,
    useEdgesState,
    useNodesState
} from "reactflow";
import {useCallback, useEffect, useRef, useState} from "react";
import 'reactflow/dist/base.css'
import TriggerNode, {triggerNodeType} from "./nodes/TriggerNode";
import FlexNode, {flexNodeType} from "./nodes/FlexNode";
import Flow from "@common/flowSystem/flow";
import {nanoid} from "nanoid";

const nodeTypes = {
    [triggerNodeType]: TriggerNode,
    [flexNodeType]: FlexNode,
}

export default ({ flow, updateFlow }: {flow: Flow, updateFlow: (flow: Flow) => void}) => {
    // Not sure why, but flow seems to be casted from a class to a Object sometimes...
    flow = Flow.fromSerialize(flow);

    const initialNodes: Node[] = flow.getNodes();
    const initialEdges: Edge[] = flow.getEdges();
    const triggerNode: Node = {
        id: 'trigger-node',
        dragHandle: 'immovable',
        position: { x: 0, y: 0 },
        data: { label: flow.name },
        type: 'trigger',
    }

    const [nodes, setNodes, onNodesChange] = useNodesState([triggerNode, ...initialNodes]);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
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

    useEffect(() => {
        flow.setNodes(nodes);
        flow.setEdges(edges);

        updateFlow(flow);
    }, [nodes, edges])

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const newNodeDataString = event.dataTransfer.getData('application/reactflow');
            const newNodeData: Partial<Node> = JSON.parse(newNodeDataString);

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            const newNode = {
                id: nanoid(),
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
