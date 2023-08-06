import FlowNode from "@common/flowSystem/flow-node";
import {FormData} from "next/dist/compiled/@edge-runtime/primitives/fetch";

interface IProps {
    flowNode: FlowNode,
    updateFlowNode: (updatedFlowNode: FlowNode) => void,
    cancelUpdate: () => void
}

export default ({ flowNode, updateFlowNode, cancelUpdate }: IProps) => {
    const { label, data, targetHandleAmount, sourceHandleAmount } = flowNode
    const { code } = data

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        debugger
        flowNode.label = formData.get('label') as string;
        flowNode.targetHandleAmount = parseInt(formData.get('targetHandleAmount') as string, 10);
        flowNode.sourceHandleAmount = parseInt(formData.get('sourceHandleAmount') as string, 10);
        flowNode.data.code = formData.get('code') as string;

        // TODO: FormData does not seem to work :/

        updateFlowNode(flowNode);
    }

    return <div className="flex w-screen h-screen absolute">
        <div className="bg-black w-1/2 opacity-40"  onClick={cancelUpdate}></div>
        <div className="bg-white w-1/2 border-l border-l-black">
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <label>
                    Label
                    <input required name='label' placeholder="Some label..." defaultValue={label} />
                </label>
                <label>
                    Target handles
                    <input required type='number' min='0' max='10' name='targetHandleAmount' defaultValue={targetHandleAmount} />
                </label>
                <label>
                    Source handles
                    <input required type='number' min='0' max='10' name='sourceHandleAmount' defaultValue={sourceHandleAmount} />
                </label>
                <label>
                    Code
                    <textarea placeholder='Memes' defaultValue={code}/>
                </label>
                <button type='submit'>
                    Save
                </button>
            </form>
        </div>
    </div>
}
