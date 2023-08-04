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
import Flow from "../../../backend/flowSystem/flow";
import FlowNode, {FlowNodeSerialized} from "../../../backend/flowSystem/flow-node";
import FlowEdge, {FlowEdgeSerialized} from "../../../backend/flowSystem/flow-edge";
import {nanoid} from "nanoid";

const nodeTypes = {
    [triggerNodeType]: TriggerNode,
    [flexNodeType]: FlexNode,
}

function flowNodeToNode(flowNode: FlowNodeSerialized): Node
{
    return {
        id: flowNode.id,
        type: flowNode.type,
        position: { x: flowNode.positionX, y: flowNode.positionY },
        data: {
            ...flowNode.data,
            label: flowNode.label,
            targetHandleAmount: flowNode.targetHandleAmount,
            sourceHandleAmount: flowNode.sourceHandleAmount,
        }
    }
}

function nodeToFlowNode(node: Node): Partial<FlowNode>
{
    const { label = '', sourceHandleAmount = 1, targetHandleAmount = 1, ...restData } = node.data
    const { x: xPos = 0, y: yPos = 0 } = node.position

    return {
        data: restData,
        id: node.id,
        label: label,
        positionX: xPos,
        positionY: yPos,
        sourceHandleAmount: sourceHandleAmount,
        targetHandleAmount: targetHandleAmount,
        type: node.type,
    }
}

function flowEdgeToEdge(flowEdge: FlowEdgeSerialized): Edge
{
    return {
        id: flowEdge.id,
        label: flowEdge.label,
        source: flowEdge.sourceId,
        target: flowEdge.targetId,
        sourceHandle: flowEdge.sourceHandleIndex.toString(10),
        targetHandle: flowEdge.targetHandleIndex.toString(10),
    }
}

function edgeToFlowEdge(edge: Edge): Partial<FlowEdge>
{
    return {
        id: edge.id,
        label: edge?.label?.toString() ?? '',
        sourceHandleIndex: parseInt(edge.sourceHandle ?? '0', 10),
        sourceId: edge.source,
        targetHandleIndex: parseInt(edge.targetHandle  ?? '0', 10),
        targetId: edge.target,
    }
}

export default ({ flow, updateFlow }: {flow: Flow, updateFlow: (flow: Flow) => void}) => {
    const initialNodes: Node[] = flow.flowNodes.map(flowNode => flowNodeToNode(flowNode));
    const initialEdges: Edge[] = flow.flowEdges.map(flowEdge => flowEdgeToEdge(flowEdge));
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
        const flowNodes  = nodes.filter(node => node.id !== 'trigger-node').map(node => nodeToFlowNode(node)) as FlowNode[];
        const flowEdges = edges.map(edge => edgeToFlowEdge(edge)) as FlowEdge[];

        flow.flowNodes = flowNodes;
        flow.flowEdges = flowEdges;

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
