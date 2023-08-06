import Link from "next/link";
import Flow from "@common/flowSystem/flow";

export default ({ flow }: { flow: Flow }) => {
    return <div className="flex justify-between px-3 py-2 bg-gray-400">
        <Link href='/flow'>
            <button>{'<-- Back'}</button>
        </Link>
        <h1>
            {flow?.name}
            <small>
                {flow?.id}
            </small>
        </h1>
    </div>
}
