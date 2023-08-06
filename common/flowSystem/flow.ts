import FlowNode from './flow-node';
import FlowEdge from './flow-edge';
import {nanoid} from "nanoid";
import type { Node, Edge } from 'reactflow';

export type FlowSerialized = Omit<Flow, never>;
export type FlowId = string;

export default class Flow {
    id: FlowId = nanoid();
    name: string = 'New flow';
    version: number = 1;
    flowNodes: FlowNode[] = [];
    flowEdges: FlowEdge[] = [];

    setNodes(nodes: Node[] = []): Flow
    {
        this.flowNodes = nodes.map(node => FlowNode.fromNode(node));

        return this;
    }

    getNodes(): Node[]
    {
        return this.flowNodes.map(flowNode => flowNode.getNode())
    }

    setEdges(edges: Edge[] = []): Flow
    {
        this.flowEdges = edges.map(edge => FlowEdge.fromEdge(edge));

        return this;
    }

    getEdges(): Edge[]
    {
        return this.flowEdges.map(flowEdge => flowEdge.getEdge())
    }

    toSerialize(): FlowSerialized
    {
        return {
            ...this,
            flowNodes: this.flowNodes.map(node => node.toSerialize()),
            flowEdges: this.flowEdges.map(edge => edge.toSerialize())
        };
    }

    static fromSerialize(flowSerialized: FlowSerialized): Flow
    {
        const {flowNodes: nodesSerialized = [], flowEdges: edgesSerialized = []} = flowSerialized;

        return Object.assign(new Flow(), {
            ...flowSerialized,
            flowNodes: nodesSerialized.map(nodeSerialized => FlowNode.fromSerialize(nodeSerialized)),
            flowEdges: edgesSerialized.map(edgeSerialized => FlowEdge.fromSerialize(edgeSerialized)),
        })
    }
}
