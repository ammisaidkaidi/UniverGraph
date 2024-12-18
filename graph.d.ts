declare namespace graph {
    export const UNDEFINED: unique symbol;
    export const ELSE: unique symbol;
    export const ERROR: unique symbol;
    type symplos = typeof ERROR | typeof ELSE | typeof UNDEFINED;
    export class END<T = any> {
        readonly value: T;
        constructor(value: T);
    }
    type edgeName = string | symplos | number | boolean | undefined;
    export type EdgeName<T> = symplos | T;
    export type edges<TaskNames extends Object, T = edgeName> = Map<T, edge<TaskNames>>;
    type OUT = any;
    export type ConcateProps<A extends Object, B extends Object, Type> = {
        [C in keyof (A & B)]?: Type;
    };
    interface X {
        [ELSE]?: never;
        [ERROR]?: never;
        [UNDEFINED]?: never;
    }
    export type Taskes<THIS, TaskArgumens extends Array<any>, TaskNames extends Object> = ConcateProps<X, TaskNames, Task<THIS, TaskArgumens, TaskNames>>;
    export type TaskeNames<TaskNames extends Object> = keyof X | keyof TaskNames;
    type ARGS<T extends Array<any>> = [...T, state: TaskState<any, any, any>];
    export interface TaskState<THIS, TaskArgumens extends Array<any>, TaskNames extends Object> {
        from?: Task<THIS, TaskArgumens, TaskNames>;
        value?: OUT;
        task: Task<THIS, TaskArgumens, TaskNames>;
        nextArguments?: TaskArgumens;
    }
    export type Task<THIS, TaskArgumens extends Array<any>, TaskNames extends Object> = task<THIS, TaskArgumens, TaskNames> | ((this: THIS, ...args: ARGS<TaskArgumens>) => any | Promise<any>);
    export interface task<THIS, TaskArgumens extends Array<any>, TaskNames extends Object> {
        readonly name?: graph.TaskeNames<TaskNames>;
        goNext?(this: THIS, out: OUT | undefined): edgeName;
        execute(this: THIS, ...args: ARGS<TaskArgumens>): any | Promise<any>;
        edges?: edges<TaskNames>;
    }
    export interface edge<TaskNames extends Object> {
        readonly name: edgeName;
        readonly source?: graph.TaskeNames<TaskNames>;
        readonly target: graph.TaskeNames<TaskNames>;
    }
    export interface graph<THIS, TaskArgumens extends Array<any>, TaskNames extends Object = any> {
        readonly name: string;
        readonly entry: graph.TaskeNames<TaskNames>;
        readonly taskes: Taskes<THIS, TaskArgumens, TaskNames>;
    }
    export function exec<THIS, TaskArgumens extends Array<any>, OUT = any, TaskNames extends Object = X>(graph: graph<THIS, TaskArgumens, TaskNames>, _this: THIS, args: TaskArgumens, entry?: TaskeNames<TaskNames>): Promise<OUT>;
    export {};
}
export default graph;
//# sourceMappingURL=graph.d.ts.map