import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {ipcRenderer} from "electron";
import FlowEditorHeader from "../../components/flow-editor/header";
import FlowEditorNodeToolbar from "../../components/flow-editor/node-toolbar";
import FlowEditor from "../../components/flow-editor/editor";
import FlowNodeEditor from "../../components/flow-editor/node-editor";
import {ReactFlowProvider} from "reactflow";
import {FlowEditorContext} from "../../contexts/flowEditorContext";
import Flow from "@common/flowSystem/flow";
import FlowNode from "@common/flowSystem/flow-node";

export default () => {
    const { query } = useRouter();
    const { id } = query;

    const [flow, setFlow] = useState<Flow>();
    const loadFlow = async (id) => {
        const flow: Flow = await ipcRenderer.invoke('get-flow', {id});
        setFlow(Flow.fromSerialize(flow));
    }
    const updateFlow = async (updatedFlow: Flow) => {
        console.log('updatedFlow', updatedFlow);
        const returnFlow: Flow = await ipcRenderer.invoke('update-flow', {flow: updatedFlow});
        console.log('returnFlow', returnFlow);
        setFlow(Flow.fromSerialize(returnFlow));
    }

    useEffect(() => {
        if (id) loadFlow(id);
    }, [id])


    const [editFlowNode, setEditFlowNode] = useState<FlowNode|null>(null)
    const editNode = (id) => setEditFlowNode(flow.getFlowNode(id));
    const updateFlowNode = (updatedFlowNode) => {
        console.log('updatedFlowNode', updatedFlowNode);
        flow.updateFlowNode(updatedFlowNode);
        updateFlow(updatedFlowNode)
            .then(() => setEditFlowNode(null))

    };

    return <ReactFlowProvider>
        <FlowEditorContext.Provider value={{ editNode }}>
            <div className='w-screen h-screen flex flex-col'>
                <FlowEditorHeader flow={flow} />
                <FlowEditorNodeToolbar />
                {flow ? <FlowEditor flow={flow} updateFlow={updateFlow} /> : ''}
                {editFlowNode ? <FlowNodeEditor flowNode={editFlowNode} updateFlowNode={updateFlowNode} cancelUpdate={() => setEditFlowNode(null)} /> : ''}
            </div>
        </FlowEditorContext.Provider>
    </ReactFlowProvider>
}
