import {nanoid} from "nanoid";
import {FlowNodeId} from "./flow-node";
import {Edge} from "reactflow";

export type FlowEdgeSerialized = Omit<FlowEdge, never>
export type FlowEdgeId = string;

export default class FlowEdge {
    id: FlowEdgeId = nanoid();
    version: number = 1;
    label: string = '';
    sourceId: FlowNodeId = '';
    targetId: FlowNodeId = '';
    sourceHandleIndex: number = 0;
    targetHandleIndex: number = 0;

    getEdge(): Edge
    {
        return {
            id: this.id,
            label: this.label,
            source: this.sourceId,
            target: this.targetId,
            sourceHandle: this.sourceHandleIndex.toString(10),
            targetHandle: this.targetHandleIndex.toString(10),
        }
    }

    toSerialize(): FlowEdgeSerialized {
        return { ...this };
    }

    static fromSerialize(flowEdgeSerialized: FlowEdgeSerialized): FlowEdge
    {
        return Object.assign(new FlowEdge(), flowEdgeSerialized);
    }
}
