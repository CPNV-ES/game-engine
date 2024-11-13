/**
 * The class can be used to add observers to an event and emit the event with data of type T (generic).
 */
export class Event<T> {
    private observers: Array<(data: T) => void> = [];

    /**
     * Adds an observer to the Event instance.
     * The observer will be called when the event is emitted.
     * @param observer
     */
    public addObserver(observer: (data: T) => void): void {
        this.observers.push(observer);
    }

    /**
     * Removes an observer from the Event instance.
     * The observer will no longer be called when the event is emitted.
     * @param observer
     */
    public removeObserver(observer: (data: T) => void): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    /**
     * Emits the event with the given data.
     * All observers will be called with the data.
     * @param data
     */
    public emit(data: T): void {
        this.observers.forEach(observer => {
            observer(data);
        });
    }
}