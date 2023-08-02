import {Handle, Position} from "reactflow";
import {useMemo, memo, useContext} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCode, faGear} from "@fortawesome/free-solid-svg-icons";
import {FlowEditorContext} from "../../../contexts/flowEditorContext";

export const flexNodeType = 'flex'

export interface FlexNodeData {
    label: string,
    code: string,
    numberOfTargets: number,
    numberOfSources: number,
}

export const flexNodeDefaultData: FlexNodeData = Object.freeze({
    label: 'Flex Node',
    code: '',
    numberOfTargets: 2,
    numberOfSources: 1,
})

export default memo(({ id, data, className = '' }) => {
    const dataWithDefaults = {...flexNodeDefaultData, ...data};
    const { numberOfSources, numberOfTargets, label } = dataWithDefaults;

    const targets = new Array(numberOfTargets).fill(null);
    const sources = new Array(numberOfSources).fill(null);

    const minHeight = useMemo(() => {
        const largestHandles = numberOfTargets > numberOfSources ? numberOfTargets : numberOfSources;
        const minHeight = 20;
        return largestHandles > 0 ? largestHandles * minHeight : minHeight;
    }, [numberOfSources, numberOfTargets]);

    const { editNode } = useContext(FlowEditorContext);

    return (
        <div className={`node_flex flex relative group ${className}`} style={{ minHeight, minWidth: '7rem' }}>

            <div className='-z-10 w-full absolute transition-all top-0 group-hover:-top-5 px-2' onClick={() => editNode(id)}>
                <div className="bg-secondairy-400 flex w-full h-5 justify-center items-center gap-1 none cursor-pointer">
                    <FontAwesomeIcon icon={faGear} className='text-xs' />
                    <label className="text-xs">Configure</label>
                </div>
            </div>

            <div className='flex flex-col justify-around'>
                {targets.map((_, i) => (
                    <Handle
                        key={i}
                        id={i.toString(10)}
                        type='target'
                        position={Position.Left}
                        className=''
                        style={{ top: 'unset', transform: 'unset', position: 'unset' }}
                    />
                ))}
            </div>

            <div className='bg-primary-600 flex justify-center items-center px-4 py-2 gap-2 w-full'>
                <FontAwesomeIcon icon={faCode} />
                <label className='whitespace-nowrap'>
                    {label}
                </label>
            </div>
            <div className='flex flex-col justify-around'>
                {sources.map((_, i) => (
                    <Handle
                        key={i}
                        id={i.toString(10)}
                        type='source'
                        position={Position.Right}
                        className=''
                        style={{ top: 'unset', transform: 'unset', position: 'unset' }}
                    />
                ))}
            </div>
        </div>

    )
})
