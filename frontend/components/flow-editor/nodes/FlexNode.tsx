import {Handle, Position} from "reactflow";
import {useMemo, memo, useContext} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCode, faGear} from "@fortawesome/free-solid-svg-icons";
import {FlowEditorContext} from "../../../contexts/flowEditorContext";
import {
    Sheet, SheetClose,
    SheetContent,
    SheetDescription, SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@frontend/components/ui/sheet";
import {Button} from "@frontend/components/ui/button";
import {Label} from "@frontend/components/ui/label";
import {Input} from "@frontend/components/ui/input";

export const flexNodeType = 'flex'

export interface FlexNodeData {
    label: string,
    code: string,
    targetHandleAmount: number,
    sourceHandleAmount: number,
}

export const flexNodeDefaultData: FlexNodeData = Object.freeze({
    label: 'Flex Node',
    code: '',
    targetHandleAmount: 2,
    sourceHandleAmount: 1,
})

export default memo(({ id, data, className = '', disableHandles = false }) => {
    const dataWithDefaults = {...flexNodeDefaultData, ...data};
    const { sourceHandleAmount, targetHandleAmount, label } = dataWithDefaults;

    const targets = new Array(targetHandleAmount).fill(null);
    const sources = new Array(sourceHandleAmount).fill(null);

    const minHeight = useMemo(() => {
        const largestHandles = targetHandleAmount > sourceHandleAmount ? targetHandleAmount : sourceHandleAmount;
        const minHeight = 20;
        return largestHandles > 0 ? largestHandles * minHeight : minHeight;
    }, [sourceHandleAmount, targetHandleAmount]);

    const { editNode } = useContext(FlowEditorContext);

    return (
        <div className={`node_flex flex relative group ${className}`} style={{ minHeight, minWidth: '7rem' }}>

            <div className='-z-10 w-full absolute transition-all top-0 group-hover:-top-5 px-2' onClick={() => editNode(id)}>
                <div className="bg-secondary flex w-full h-5 justify-center items-center gap-1 none cursor-pointer">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size='sm'>Open</Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Edit profile</SheetTitle>
                                <SheetDescription>
                                    Make changes to your profile here. Click save when you're done.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input id="name" value="Pedro Duarte" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right">
                                        Username
                                    </Label>
                                    <Input id="username" value="@peduarte" className="col-span-3" />
                                </div>
                            </div>
                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button type="submit">Save changes</Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {disableHandles ? '' : <div className='flex flex-col justify-around'>
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
            </div>}

            <div className='bg-primary-foreground flex justify-center items-center px-4 py-2 gap-2 w-full'>
                <FontAwesomeIcon icon={faCode} />
                <label className='whitespace-nowrap'>
                    {label}
                </label>
            </div>
            {disableHandles ? '' : <div className='flex flex-col justify-around'>
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
            </div>}

        </div>

    )
})
