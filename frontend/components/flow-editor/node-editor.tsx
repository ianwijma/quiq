import FlowNode from "@common/flowSystem/flow-node";
import {FormData} from "next/dist/compiled/@edge-runtime/primitives/fetch";
import useForm from "@frontend/hooks/useForm";

interface IProps {
    flowNode: FlowNode,
    updateFlowNode: (updatedFlowNode: FlowNode) => void,
    cancelUpdate: () => void
}

export default ({ flowNode, updateFlowNode, cancelUpdate }: IProps) => {
    const { label, data, targetHandleAmount, sourceHandleAmount } = flowNode
    const { code } = data

    const [formRef, formState] = useForm({
        label, targetHandleAmount, sourceHandleAmount, code
    })

    const handleSubmit = (event) => {
        event.preventDefault();

        flowNode.label = formState.label as string;
        flowNode.targetHandleAmount = formState.targetHandleAmount as number;
        flowNode.sourceHandleAmount = formState.sourceHandleAmount as number;
        flowNode.data.code = formState.code as string;

        updateFlowNode(flowNode);
    }

    return <div className="flex w-screen h-screen absolute">
        <div className="bg-black w-1/2 opacity-40"  onClick={cancelUpdate}></div>
        <div className="bg-white w-1/2 border-l border-l-black">
            <form className="flex flex-col" onSubmit={handleSubmit} ref={formRef}>
                <label>
                    Label
                    <input required name='label' placeholder="Some label..." />
                </label>
                <label>
                    Target handles
                    <input required type='number' min='0' max='10' name='targetHandleAmount' />
                </label>
                <label>
                    Source handles
                    <input required type='number' min='0' max='10' name='sourceHandleAmount' />
                </label>
                <label>
                    Code
                    <textarea name='code' placeholder='Memes'/>
                </label>
                <button type='submit'>
                    Save
                </button>
            </form>
        </div>
    </div>
}
