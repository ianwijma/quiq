import Flow, {FlowId, FlowSerialized} from "./flow";
import Store from "electron-store";

export type FlowMap = { [key: FlowId]: Flow };
export type FlowMapSerialized = { [key: FlowId]: FlowSerialized }
export type FlowMapStoreRecord = Record<string, FlowMapSerialized>;

export default class FlowStore {
    constructor(
        private map: FlowMap = {},
        private store: Store = new Store<FlowMapStoreRecord>({ name: 'flow-store' }),
    ) {}

    create (name: string): Flow
    {
        const flow = Object.assign(new Flow(), { name });

        // Update adds the flow if it does not exist already
        return this.update(flow);
    }

    list() {
        return Object.values(this.map);
    }

    update(flow: Flow): Flow
    {
        const { id } = flow;

        this.map[id] = flow;
        this.save();

        return flow;
    }

    delete(flow: Flow): Flow
    {
        const { id } = flow;

        delete this.map[id];
        this.save();

        return flow
    }

    get(id: FlowId): Flow|null
    {
        return this.map[id] ?? null;
    }

    save()
    {
        const flowMapSerialized: FlowMapSerialized = Object.keys(this.map).reduce((returnObject, key) => {
            const flow = this.map[key];
            returnObject[key] = flow.toSerialize();
            return returnObject;
        }, {});

        this.store.set('serialized-flow-map', flowMapSerialized);
    }

    load()
    {
        const flowMapSerialized: FlowMapSerialized =
            this.store.get<FlowMapStoreRecord>('serialized-flow-map', {});

        Object.keys(flowMapSerialized).forEach(id => {
            const flowSerialised = flowMapSerialized[id];
            this.map[id] = Flow.fromSerialize(flowSerialised);
        });
    }
}
