import { Eventing } from "./Eventing";
import axios, { AxiosResponse } from "axios";

export class Collection<T, K> {
    //of type array of users with default value []
    models: T[] = [];
    events: Eventing = new Eventing();

    constructor(public rootUrl: string, public deserialize: (json: K) => T) { }

    get on() {
        return this.events.on;
    }
    get trigger() {
        return this.events.trigger;
    }

    fetch(): void {
        axios.get(this.rootUrl)
            .then((response: AxiosResponse) => {
                response.data.forEach((value: K) => {
                    this.models.push(this.deserialize(value));
                })
            })
        this.trigger('change');

    }


}