
namespace graph {
    export const UNDEFINED = Symbol.for('UNDEFINED');
    export const ELSE = Symbol.for('ELSE');
    export const ERROR = Symbol.for('ERROR');
    declare type symplos = typeof ERROR | typeof ELSE | typeof UNDEFINED;
    export class END<T = any> { constructor(public readonly value: T) { } }
    declare type taskName = string | symplos | number;
    declare type edgeName = string | symplos | number | boolean | undefined;
    export declare type EdgeName<T> = symplos | T;
    export declare type edges<TaskNames extends Object, T = edgeName> = Map<T, edge<TaskNames>>;

    declare type OUT = any;
    export type ConcateProps<A extends Object, B extends Object, Type> = {
        [C in keyof (A & B)]?: Type;
    }



    interface X {
        [ELSE]?: never;
        [ERROR]?: never;
        [UNDEFINED]?: never;
    }
    const fs: ConcateProps<{}, {}, any> = { '1': true } satisfies ConcateProps<1, 5, any>;

    export declare type Taskes<THIS, TaskArgumens extends Array<any>, TaskNames extends Object> = ConcateProps<X, TaskNames, Task<THIS, TaskArgumens, TaskNames>>
    export declare type TaskeNames<TaskNames extends Object> = keyof X | keyof TaskNames;// ConcateProps<X, TaskNames, void>

    // export type Taskes<THIS, TaskArgumens extends Array<any> = [], P extends { [n: string]: Task<THIS, TaskArgumens> } = any> = {
    //     [N in keyof (X<THIS, TaskArgumens, P>)]?: Task<THIS, TaskArgumens>;
    //     [X in keyof(P)]?: Task<THIS, TaskArgumens>;
    //     // [ELSE]?: Task<THIS, TaskArgumens>;
    //     // //[n: number]: Task<THIS, TaskArgumens>;
    //     // //[N in keyof P]: Task<THIS, TaskArgumens> | never;
    //     // [ERROR]?: Task<THIS, TaskArgumens>;
    //     // [UNDEFINED]?: Task<THIS, TaskArgumens>;
    // };
    const g: Taskes<any, any, { 'ELSE': undefined }> = {

    } satisfies Taskes<any, any, { 'ELSE': true }>;


    // export interface Taskes<THIS, TaskArgumens extends Array<any> = [], P > {
    //     [ELSE]?: Task<THIS, TaskArgumens>;
    //     //[n: number]: Task<THIS, TaskArgumens>;
    //     [N in keyof P]: Task<THIS, TaskArgumens> | never;
    //     [ERROR]?: Task<THIS, TaskArgumens>;
    //     [UNDEFINED]?: Task<THIS, TaskArgumens>;
    // }
    declare type ARGS<T extends Array<any>> = [...T, state: TaskState<any, any, any>];

    export interface TaskState<THIS, TaskArgumens extends Array<any>, TaskNames extends Object> {
        from?: Task<THIS, TaskArgumens, TaskNames>;
        value?: OUT;

        task: Task<THIS, TaskArgumens, TaskNames>;

        nextArguments?: TaskArgumens;
    }
    export declare type Task<THIS, TaskArgumens extends Array<any>, TaskNames extends Object>
        = task<THIS, TaskArgumens, TaskNames> | ((this: THIS, ...args: ARGS<TaskArgumens>) => any | Promise<any>)
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

    interface scop<THIS, TaskArgumens extends Array<any>, TaskNames extends Object> {
        _this: THIS;
        state: TaskState<THIS, TaskArgumens, TaskNames>;
        args: TaskArgumens;

        graph: graph<THIS, TaskArgumens>;
        task: Task<THIS, TaskArgumens, TaskNames>,

        value?: OUT;

        nextGraph?: graph<THIS, TaskArgumens>;
        nextTask?: Task<THIS, TaskArgumens, TaskNames>;
    }

    const graphes = new Map<string, graph<any, any, any>>();

    export async function exec<THIS, TaskArgumens extends Array<any>, OUT = any, TaskNames extends Object = X>(graph: graph<THIS, TaskArgumens, TaskNames>, _this: THIS, args: TaskArgumens, entry?: TaskeNames<TaskNames>) {

        let scop: scop<THIS, TaskArgumens, TaskNames> | undefined = {
            _this, state: {
                task: graph.taskes[entry || graph.entry] as Task<THIS, TaskArgumens, TaskNames>
            }, args, graph, task: graph.taskes[graph.entry] as Task<THIS, TaskArgumens, TaskNames>
        }
        let pscop: typeof scop = scop, value: OUT, end = false, c;
        do {
            const task = scop.task;
            const pvalue = (typeof task === 'function' ? task : task.execute).apply(scop._this, [...scop.args, scop.state]);
            value = pvalue instanceof Promise ? await pvalue : pvalue;
            if (value instanceof END) {
                debugger; end = true; value = value.value;
            }
            (pscop = scop).value = value;
            c = !end && (scop = getNext(scop));

        } while (!end && scop);
        return value;
    }
    function getNext<THIS, TaskArgumens extends Array<any>, TaskNames extends Object = X>(scop: scop<THIS, TaskArgumens, TaskNames>): scop<THIS, TaskArgumens, TaskNames> | undefined {
        let task: Task<THIS, TaskArgumens, TaskNames> | undefined = scop.task;
        let graph: graph<THIS, TaskArgumens, TaskNames> | undefined = scop.graph;
        if (typeof task !== 'function' && (task.goNext || task.edges)) {
            const edge = task.edges!.get(task.goNext ? task.goNext.call(scop._this, scop.value) : scop.value as any as edgeName);
            if (edge) {
                graph = scop.graph;
                task = graph.taskes[edge.target];
            } else { task = undefined, graph = undefined };
        } else
            task = scop.graph.taskes[scop.value as any] as Task<THIS, TaskArgumens, TaskNames>;
        scop.nextGraph = graph;
        scop.nextTask = task;
        return scop.nextGraph && scop.nextTask ? {
            graph: scop.nextGraph,
            task: scop.nextTask,

            _this: scop._this,
            args: scop.state.nextArguments || scop.args,
            state: { task: scop.nextTask, from: scop.task, value: scop.value },
        } : undefined;
    }
}
export default graph;
