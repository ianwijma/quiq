import {createContext} from "react";

export interface FlowEditorContextType {
    editNode: (id: string) => void
}

export const FlowEditorContext = createContext<FlowEditorContextType>({
    editNode: (id) => console.log(id)
});
