import { AxiosPromise, AxiosResponse } from "axios";

interface ModelAttributes<T> {
    set(update: T): void;
    getAll(): T;
    get<K extends keyof T>(key: K): T[K];

}

interface Sync<T> {
    fetch(id: number): AxiosPromise;
    save(data: T): AxiosPromise<T>;
}

interface Events {
    on(eventName: string, callback: () => void): void;
    trigger(eventName: string): void;
}
export interface HasId {
    id?: number;
}
export class Model<T extends HasId> {
    constructor(
        private attributes: ModelAttributes<T>,
        private events: Events,
        private sync: Sync<T>
    ) { }

    get on() {
        return this.events.on;
    }

    get trigger() {
        return this.events.trigger;
    }
    get get() {
        return this.attributes.get;
    }

    set(update: T): void {
        this.attributes.set(update);
        this.events.trigger('change')
    }
    fetch(): void {
        const id = this.attributes.get('id');
        if (typeof id !== 'number') {
            throw new Error('cannot fetch withhout id');
        }

        this.sync.fetch(id).then((response: AxiosResponse): void => {
            //here we use the set method defined in this file to be  able to trigger the change event
            this.set(response.data)
        })
    }

    save(): void {
        this.sync.save(this.attributes.getAll())
            .then((response: AxiosResponse): void => {
                this.trigger('save');
            })
            .catch(() => {
                this.trigger('error');
            })
    }
}