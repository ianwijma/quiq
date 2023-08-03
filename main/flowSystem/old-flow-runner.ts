// import Flow from "../flow/flow";
// import ivm from 'isolated-vm';
// import {FlowNodeTypes} from "../flow/flow-node";
//
// export default class OldFlowRunner {
//     constructor(private vm = new ivm.Isolate({ memoryLimit: 128 })) {}
//
//
//     async run(flow: Flow): Promise<boolean> {
//         const { flowNodes } = flow;
//         const nodeMap = nodes.reduce((previousValue, currentValue) => {
//             const {id} = currentValue;
//             previousValue[id] = currentValue;
//             return previousValue;
//         }, {});
//
//         const startNode = nodes.find(n => n.type === FlowNodeTypes.START);
//         const inputNodeMap = nodes.reduce((returnValue, flowNode) => {
//             const { inputs } = flowNode;
//             return inputs.reduce((previousValue, currentValue) => {
//                 previousValue[currentValue.id] = flowNode;
//                 return previousValue;
//             }, returnValue);
//         }, {})
//         const outputNodeMap = nodes.reduce((returnValue, flowNode) => {
//             const { outputs } = flowNode;
//             return outputs.reduce((previousValue, currentValue) => {
//                 previousValue[currentValue.id] = flowNode;
//                 return previousValue;
//             }, returnValue);
//         }, {});
//
//
//         const context = await this.vm.createContext();
//         const jail = context.global;
//         await jail.set('getFlow', flow.serialize());
//
//         /*
//          * TODO:
//          *  We should look into better flow management:
//          *      - Better multi path support
//          *      - Variables are per path, and not per flow
//          *      - Knowing which input node was triggered
//          */
//
//         const flowVariables= {};
//         await jail.set('setVariable', (key, variable) => flowVariables[key] = variable)
//         await jail.set('hasVariable', (key) => key in flowVariables);
//         await jail.set('getVariable', (key, fallback = null) => flowVariables[key] ?? fallback);
//
//         let targetNodes = [startNode];
//         while (targetNodes.length) {
//             const nextTargetNodes = [];
//
//             for (const targetNode of targetNodes) {
//                 await jail.set('getFlowNode', targetNode.serialize());
//                 const { outputs, script } = targetNode;
//                 await jail.set('triggerOutput', (index) => {
//                     const output = outputs[index] ?? null;
//                     if (output) {
//                         const { connectedIds } = output;
//                         connectedIds.forEach(inputId => {
//                             const inputNode = inputNodeMap[inputId];
//                             nextTargetNodes.push(inputNode);
//                         });
//                     }
//                 });
//
//                 await context.eval(script);
//             }
//
//             targetNodes = nextTargetNodes;
//         }
//
//
//         return;
//     }
// }
