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
