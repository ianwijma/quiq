import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {ipcRenderer} from "electron";
import FlowEditorHeader from "../../components/flow-editor/header";
import FlowEditorNodeToolbar from "../../components/flow-editor/node-toolbar";
import FlowEditor from "../../components/flow-editor/editor";
import Flow from "../../../main/flow/flow";
import {ReactFlowProvider} from "reactflow";

export default () => {
    const { query } = useRouter();
    const { id } = query;

    const [flow, setFlow] = useState<Flow>();
    const loadFlow = async (id) => {
        const flow: any = await ipcRenderer.invoke('get-flow', {id});
        setFlow(flow);
    }
    const updateFlow = async (flow: Flow) => {
        const updatedFlow: any = await ipcRenderer.invoke('update-flow', {flow});
        setFlow(updatedFlow);
    }

    useEffect(() => {
        if (id) loadFlow(id);
    }, [id])

    useEffect(() => {
        if (flow) updateFlow(flow);
    }, [flow]);

    return <ReactFlowProvider>
        <div className='w-screen h-screen flex flex-col'>
            <FlowEditorHeader flow={flow} />
            <FlowEditorNodeToolbar toolbarNodes={[{label: 'memes', node: {type: 'default'}}]} />
            <FlowEditor />
        </div>
    </ReactFlowProvider>
}
