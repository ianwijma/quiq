import Store from 'electron-store';
import Flow from "./flow";
import type { FlowId } from "./flow";

export type FlowMap = {[key: FlowId]: Flow};
type SerializedFlow = Omit<Flow, never>
type SerializedFlowMap = {[key: FlowId]: SerializedFlow};

export default class FlowStorage {
    constructor(
        private flowMap: FlowMap = {},
        private store: Store = new Store({ name: 'flow-storage' })
    ) {}

    create(name: string): Flow
    {
        const flow = new Flow(name);
        const { id } = flow;

        this.flowMap[id] = flow;
        this.save();

        return flow;
    }

    list(): Flow[]
    {
        return Object.values(this.flowMap);
    }

    map(): FlowMap
    {
        return this.flowMap;
    }

    update(flow: Flow): Flow
    {
        const { id } = flow;

        if (id in this.flowMap) {
            this.flowMap[id] = flow;
            this.save();
        } else {
            throw Error(`Flow with id "${id}" was not found`);
        }

        return flow;
    }

    delete(flow: Flow): Flow
    {
        const { id } = flow;

        delete this.flowMap[id];
        this.save();

        return flow;
    }

    load()
    {
        const serializedFlowMap: SerializedFlowMap =
            this.store.get<Record<string, SerializedFlowMap>>('flow-storage', {});

        for (const serializedFlow of serializedFlowMap) {
            const { id } = serializedFlow;
            this.flowMap[id] = Flow.fromSerialisedFlow(serializedFlow);
        }
    }

    save()
    {
        const serializedFlowMap = {};

        for (const flow of this.flowMap) {
            const { id } = flow;
            serializedFlowMap[id] = flow.serialize();
        }

        this.store.set('flow-storage', serializedFlowMap);
    }
}
