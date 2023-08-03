import {ipcRenderer} from 'electron'
import {useEffect, useState} from "react";
import Link from "next/link";
import Flow from "../../../main/flowSystem/flow";

export default () => {
    const [flows, setFlows] = useState<Flow[]>([]);

    useEffect(() => {
        (async function() {
            const listFlows: Flow[] = await ipcRenderer.invoke('list-flows');
            setFlows(listFlows);
        }())
    }, []);

    return <ul>
        <li>
            <Link href='/flow/create'>Create Flow</Link>
        </li>
        {flows.map(({ id, name }) => (
            <li>
                <Link key={id} href={`/flow/${id}`}>{name}</Link>
            </li>
        ))}
    </ul>
}
