import {Handle, Position} from "reactflow";
import { memo } from 'react';

export const triggerNodeType = 'trigger'

export interface TriggerNodeData {
    label: string,
}

export const triggerNodeDefaultData: TriggerNodeData = Object.freeze({
    label: 'Trigger Node',
})

export default memo(({ data }) => {
        const dataWithDefaults = {...triggerNodeDefaultData, ...data};
        const { label } = dataWithDefaults
        return (
            <div>
                <div className='bg-primary-600 flex justify-center items-center px-4'>
                    <i>trigger icon</i>
                    <label>
                        {label}
                    </label>
                </div>

                <Handle type='source' position={Position.Right} className={''} />
            </div>

        )

    }
)
