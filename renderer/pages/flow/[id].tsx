import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {ipcRenderer} from "electron";
import FlowEditorHeader from "../../components/flow-editor/header";
import FlowEditorNodeToolbar from "../../components/flow-editor/node-toolbar";
import FlowEditor from "../../components/flow-editor/editor";
import {ReactFlowProvider} from "reactflow";
import {FlowEditorContext} from "../../contexts/flowEditorContext";
import Flow from "../../../main/flowSystem/flow";

export default () => {
    const { query } = useRouter();
    const { id } = query;

    const [flow, setFlow] = useState<Flow>();
    const loadFlow = async (id) => {
        const flow: Flow = await ipcRenderer.invoke('get-flow', {id});
        setFlow(flow);
    }
    const updateFlow = async (flow: Flow) => {
        const updatedFlow: Flow = await ipcRenderer.invoke('update-flow', {flow});
        setFlow(updatedFlow);
    }

    useEffect(() => {
        if (id) loadFlow(id);
    }, [id])

    // TODO: Move flow items here & create edit panel
    const editNode = (id) => console.log(id);

    return <ReactFlowProvider>
        <FlowEditorContext.Provider value={{ editNode }}>
            <div className='w-screen h-screen flex flex-col'>
                <FlowEditorHeader flow={flow} />
                <FlowEditorNodeToolbar />
                {flow ? <FlowEditor flow={flow} updateFlow={updateFlow} /> : ''}
            </div>
        </FlowEditorContext.Provider>
    </ReactFlowProvider>
}
