import {Handle, Position} from "reactflow";
import { memo } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShuffle} from "@fortawesome/free-solid-svg-icons";

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
                <div className='bg-primary-foreground flex justify-center items-center px-4 gap-2'>
                    <FontAwesomeIcon icon={faShuffle} />
                    <label>
                        {label}
                    </label>
                </div>

                <Handle type='source' position={Position.Right} className={''} />
            </div>

        )

    }
)
