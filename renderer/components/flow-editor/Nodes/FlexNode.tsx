import {Handle, Position} from "reactflow";
import {useMemo, memo} from "react";

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

export default memo(({ data, className = '' }) => {
    const dataWithDefaults = {...flexNodeDefaultData, ...data};
    const { numberOfSources, numberOfTargets, label } = dataWithDefaults;

    const targets = new Array(numberOfTargets).fill(null);
    const sources = new Array(numberOfSources).fill(null);

    const minHeight = useMemo(() => {
        const largestHandles = numberOfTargets > numberOfSources ? numberOfTargets : numberOfSources;
        const minHeight = 15;
        return largestHandles > 0 ? largestHandles * minHeight : minHeight;
    }, [numberOfSources, numberOfTargets]);

    return (
        <div className={`node_flex flex ${className}`} style={{ minHeight }}>
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

            <div className='bg-primary-600 flex justify-center items-center px-4'>
                <i>code icon</i>
                <label>
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
