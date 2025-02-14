
export class Attribute<T> {
    constructor(private data: T) { }
    // here we are basically telling ts that the get method can only take a key of the T(UserProp)
    //i.e K can be name,age,id ONLY
    //esentally name, age, id are types
    get = <K extends keyof T>(key: K): (T[K]) => {
        return this.data[key];
    }

    set(update: T): void {
        //js inbuild fn
        Object.assign(this.data, update)
    }

    getAll(): T {
        return this.data;
    }
}

