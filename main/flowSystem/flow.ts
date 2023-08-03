import FlowNode from './flow-node';
import FlowEdge from './flow-edge';
import {nanoid} from "nanoid";

export type FlowSerialized = Omit<Flow, never>;
export type FlowId = string;

export default class Flow {
    id: FlowId = nanoid();
    name: string = 'New flow';
    version: number = 1;
    nodes: FlowNode[] = [];
    edges: FlowEdge[] = [];

    toSerialize(): FlowSerialized
    {
        return {
            ...this,
            nodes: this.nodes.map(node => node.toSerialize()),
            edges: this.edges.map(edge => edge.toSerialize())
        };
    }

    static fromSerialize(flowSerialized: FlowSerialized): Flow
    {
        const {nodes: nodesSerialized = [], edges: edgesSerialized = []} = flowSerialized;

        return Object.assign(new Flow(), {
            ...flowSerialized,
            nodes: nodesSerialized.map(nodeSerialized => FlowNode.fromSerialize(nodeSerialized)),
            edges: edgesSerialized.map(edgeSerialized => FlowEdge.fromSerialize(edgeSerialized)),
        })
    }
}
