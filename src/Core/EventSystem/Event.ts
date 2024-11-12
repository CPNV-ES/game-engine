export class Event<T> {
    private observers: Array<(data: T) => void> = [];

    public addObserver(observer: (data: T) => void): void {
        this.observers.push(observer);
    }

    public removeObserver(observer: (data: T) => void): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    public emit(data: T): void {
        this.observers.forEach(observer => {
            observer(data);
        });
    }
}