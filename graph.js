var graph;
(function (graph_1) {
    graph_1.UNDEFINED = Symbol.for('UNDEFINED');
    graph_1.ELSE = Symbol.for('ELSE');
    graph_1.ERROR = Symbol.for('ERROR');
    class END {
        constructor(value) {
            this.value = value;
        }
    }
    graph_1.END = END;
    const fs = { '1': true };
    // export type Taskes<THIS, TaskArgumens extends Array<any> = [], P extends { [n: string]: Task<THIS, TaskArgumens> } = any> = {
    //     [N in keyof (X<THIS, TaskArgumens, P>)]?: Task<THIS, TaskArgumens>;
    //     [X in keyof(P)]?: Task<THIS, TaskArgumens>;
    //     // [ELSE]?: Task<THIS, TaskArgumens>;
    //     // //[n: number]: Task<THIS, TaskArgumens>;
    //     // //[N in keyof P]: Task<THIS, TaskArgumens> | never;
    //     // [ERROR]?: Task<THIS, TaskArgumens>;
    //     // [UNDEFINED]?: Task<THIS, TaskArgumens>;
    // };
    const g = {};
    const graphes = new Map();
    async function exec(graph, _this, args, entry) {
        let scop = {
            _this, state: {
                task: graph.taskes[entry || graph.entry]
            }, args, graph, task: graph.taskes[graph.entry]
        };
        let pscop = scop, value, end = false, c;
        do {
            const task = scop.task;
            const pvalue = (typeof task === 'function' ? task : task.execute).apply(scop._this, [...scop.args, scop.state]);
            value = pvalue instanceof Promise ? await pvalue : pvalue;
            if (value instanceof END) {
                debugger;
                end = true;
                value = value.value;
            }
            (pscop = scop).value = value;
            c = !end && (scop = getNext(scop));
        } while (!end && scop);
        return value;
    }
    graph_1.exec = exec;
    function getNext(scop) {
        let task = scop.task;
        let graph = scop.graph;
        if (typeof task !== 'function' && (task.goNext || task.edges)) {
            const edge = task.edges.get(task.goNext ? task.goNext.call(scop._this, scop.value) : scop.value);
            if (edge) {
                graph = scop.graph;
                task = graph.taskes[edge.target];
            }
            else {
                task = undefined, graph = undefined;
            }
            ;
        }
        else
            task = scop.graph.taskes[scop.value];
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
})(graph || (graph = {}));
export default graph;
//# sourceMappingURL=graph.js.map