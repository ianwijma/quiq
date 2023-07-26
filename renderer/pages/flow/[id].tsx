import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {ipcRenderer} from "electron";
import FlowEditor from "../../../components/flow/flow-editor";

export default () => {
    const { query } = useRouter();
    const { id } = query;

    const [flow, setFlow] = useState<any>();
    const loadFlow = async (id) => {
        const flow: any = await ipcRenderer.invoke('get-flow', {id});
        setFlow(flow);
    }
    const updateFlow = async (flow: any) => {
        const updatedFlow: any = await ipcRenderer.invoke('update-flow', {flow});
        setFlow(updatedFlow);
    }

    useEffect(() => {
        if (id) loadFlow(id);
    }, [id])

    useEffect(() => {
        if (flow) updateFlow(flow);
    }, [flow]);

    return <div>
        Flow ID: {id}
        <br/>
        Flow: {JSON.stringify(flow)}

        {flow ? <FlowEditor flow={flow} updateFlow={f => setFlow(f)} /> : ''}
    </div>
}
