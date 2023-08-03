import {nanoid} from "nanoid";

export type FlowNodeSerialized = Omit<FlowNode, never>
export type FlowNodeId = string;

export default class FlowNode {
    id: FlowNodeId = nanoid();
    version: number = 1;
    type: string = 'flex';
    label: string = 'New node';
    data: any = {};
    positionX: number = 0;
    positionY: number = 0;
    targetHandleAmount: number = 1;
    sourceHandleAmount: number = 1;

    toSerialize(): FlowNodeSerialized {
        return { ...this };
    }

    static fromSerialize(flowNodeSerialized: FlowNodeSerialized): FlowNode
    {
        return Object.assign(new FlowNode(), flowNodeSerialized);
    }
}
