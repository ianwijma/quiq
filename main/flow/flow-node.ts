import {nanoid} from "nanoid";

export type FlowNodeId = string;
export type FlowNodeScript = string

export interface FlowNodeIO {
    id: string,
    connectedIds: string[]
}

export enum FlowNodeTypes {
    START,
    SCRIPT,
}

export class FlowNode {
    id: FlowNodeId = nanoid();
    name: string = 'No name';
    version: number = 1;
    type: FlowNodeTypes = FlowNodeTypes.SCRIPT;
    inputs: FlowNodeIO[] = [];
    outputs: FlowNodeIO[] = [];
    script: FlowNodeScript = '';

    serialize(): Omit<FlowNode, never>
    {
        const {...serializedFlow} = this;

        return {...serializedFlow};
    }

    static fromSerialisedFlowNode(serialisedFlowNode: Omit<FlowNode, never>): FlowNode
    {
        const flowNode = new FlowNode();

        for (const key in serialisedFlowNode) {
            flowNode[key] = serialisedFlowNode[key]
        }

        return flowNode;
    }
}
