import {nanoid} from "nanoid";
import {FlowNode} from "./flow-node";

export type FlowId = string;

export default class Flow {
    id: FlowId = nanoid();
    name: string = 'No name';
    version: number = 1;
    nodes: FlowNode[] = [];

    constructor(name: string = 'No name') {
        this.name = name;
    }

    serialize(): Omit<Flow, never>
    {
        const {nodes, ...serializedFlow} = this;

        return {...serializedFlow, nodes: nodes.map(n => n.serialize())};
    }

    static fromSerialisedFlow(serialisedFlow: Omit<Flow, never>): Flow
    {
        const flow = new Flow();

        for (const key in serialisedFlow) {
            const value = serialisedFlow[key];

            if (key === 'nodes') {
                flow[key] = value.map(serialisedFlowNode => FlowNode.fromSerialisedFlowNode(serialisedFlowNode))
            } else {
                flow[key] = value
            }
        }

        return flow;
    }
}
