import Flow from "../../../main/flow/flow";
import {ReactFlow} from "reactflow";

export default ({flow, updateFlow}: {flow: Flow, updateFlow: (flow: Flow) => void}) => {
    return <div className='w-full h-full'>
        <ReactFlow  />
    </div>
}
