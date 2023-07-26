import { ipcRenderer } from 'electron';
import {useRef} from "react";
import Flow from "../../../main/flow/flow";
import {useRouter} from "next/router";

export default () => {
    const router = useRouter();
    const ref = useRef();
    const submitForm = async (event) => {
        event.preventDefault();

        const {current} = ref;

        const flow: Flow = await ipcRenderer.invoke('create-flow', {name: current.value});

        router.push(`/flow/${flow.id}`);
    }

    return <form className='flex flex-col gap-5' onSubmit={submitForm}>
        <input ref={ref} placeholder='Flow name' className='text-black' required />
        <button type='submit'>Create Flow</button>
    </form>
}
