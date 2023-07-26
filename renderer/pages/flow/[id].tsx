import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Flow from "../../../main/flow/flow";
import {ipcRenderer} from "electron";

export default () => {
    const { query } = useRouter();
    const { id } = query;

    const [flow, setFlow] = useState<Flow>();
    const loadFlow = async (id) => {
        const flow: Flow = await ipcRenderer.invoke('get-flow', {id});
        setFlow(flow);
    }

    useEffect(() => {
        loadFlow(id);
    }, [id])

    return <div>
        Flow ID: {id}
        <br/>
        Flow: {JSON.stringify(flow)}
    </div>
}
