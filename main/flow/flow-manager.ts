import FlowStorage, {FlowMap} from "./flow-storage";
import FlowRunner from "./flow-runner";
import Flow from "./flow";

export class FlowManager {
    constructor(
        private flowStorage: FlowStorage = new FlowStorage(),
        private flowRunner: FlowRunner = new FlowRunner(),
    ) {}

    createFlow(name: string): Flow
    {
        return this.flowStorage.create(name);
    }

    mapFlows(): FlowMap {
        return this.flowStorage.map();
    }

    listFlows(): Flow[] {
        return this.flowStorage.list();
    }

    updateFlow(flow: Flow): Flow {
        return this.flowStorage.update(flow);
    }

    deleteFlow(flow: Flow): Flow
    {
        return this.flowStorage.delete(flow);
    }

    async runFlow(flow: Flow): Promise<boolean>
    {
        return this.flowRunner.run(flow);
    }

    async loadFlows(): Promise<void>
    {
        await this.flowStorage.load();
    }
}
