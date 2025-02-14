import { Eventing } from "./Eventing";
import { Sync } from "./Sync";
import { Attribute } from "./Attributes";
import { AxiosResponse } from "axios";

export interface UserProps {
    name?: string;
    age?: number;
    id?: number;
}

const rootUrl = 'http://localhost:3000/users'
export class User {
    public events: Eventing = new Eventing();
    public sync: Sync<UserProps> = new Sync(rootUrl);
    public attributes: Attribute<UserProps>
    constructor(attrs: UserProps) {
        this.attributes = new Attribute<UserProps>(attrs);
    }


    get on() {
        return this.events.on;
    }
    get trigger() {
        return this.events.trigger;
    }
    get get() {
        return this.attributes.get;
    }

    set(update: UserProps): void {
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