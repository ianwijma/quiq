import Flow from "../../../main/flow/flow";

export default ({ flow }: { flow: Flow }) => {
    return <div>
        Flow ID: {flow?.id}
        <br/>
        Flow: {JSON.stringify(flow ?? {})}
    </div>
}
