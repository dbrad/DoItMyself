/**
 * Abstract Pattern classes can live here for now.
 * ie. State Machines, Subject/Observer, ECS Base classes
 */

class Subject {
    private Observers: any[] = [];
    addObserver(callback: any) {
        this.Observers.push(callback);
    }
    emit(data: any): void {
        for (let obv of this.Observers) {
            obv(data);
        }
    }
}

/** ECS */
interface Component {
    name: string;
}
interface ComponentArray {
    [index: string]: Component;
}
class Entity {
    private static autoID = 0;
    private _count: number = 0;

    private id: number;
    components: ComponentArray = {};

    constructor() {
        this.id = Entity.autoID++;
    }

    addComponent(c: Component): void {
        if (!this.components[c.name])
            this._count++;
        this.components[c.name] = c;
        this[c.name] = this.components[c.name]
    }
}

/** State */
interface IState {
    update(delta: number): void;
    draw(ctx: Context2D): void;
    onExit(): void;
    onEnter(...params: any[]): void;
}

interface StateArray {
    [index: string]: IState
}
class StateMachine {
    private mStates: StateArray = {}
    private mCurrentState: IState;

    update(delta: number) {
        this.mCurrentState.update(delta);
    }

    draw(ctx: Context2D) {
        this.mCurrentState.draw(ctx);
    }

    change(stateName: string, ...params: any[]) {
        this.mCurrentState.onExit();
        this.mCurrentState = this.mStates[stateName];
        this.mCurrentState.onEnter(params);
    }

    add(name: string, state: IState) {
        this.mStates[name] = state;
    }
}

class StateStack {
    private mStates: StateArray = {};
    private mStack: IState[] = [];

    update(delta: number) {
        this.mStack[this.mStack.length - 1].update(delta);
    }

    draw(ctx: Context2D) {
        this.mStack[this.mStack.length - 1].draw(ctx);
    }

    add(name: string, state: IState) {
        this.mStates[name] = state;
    }

    push(name: string) {
        this.mStack.push(this.mStates[name]);
    }

    pop() {
        return this.mStack.pop();
    }
}
