import {nanoid} from "nanoid";
import { Node } from 'reactflow';

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

    getNode(): Node
    {
        return {
            id: this.id,
            type: this.type,
            position: { x: this.positionX, y: this.positionY },
            data: {
                ...this.data,
                label: this.label,
                targetHandleAmount: this.targetHandleAmount,
                sourceHandleAmount: this.sourceHandleAmount,
            }
        }
    }

    static fromNode(node: Node): FlowNode
    {
        const { label = '', sourceHandleAmount = 1, targetHandleAmount = 1, ...restData } = node.data
        const { x: xPos = 0, y: yPos = 0 } = node.position

        return Object.assign(
            new FlowNode(),
            {
                data: restData,
                id: node.id,
                label: label,
                positionX: xPos,
                positionY: yPos,
                sourceHandleAmount: sourceHandleAmount,
                targetHandleAmount: targetHandleAmount,
                type: node.type,
            }
        )
    }

    toSerialize(): FlowNodeSerialized {
        return { ...this };
    }

    static fromSerialize(flowNodeSerialized: FlowNodeSerialized): FlowNode
    {
        return Object.assign(new FlowNode(), flowNodeSerialized);
    }
}
