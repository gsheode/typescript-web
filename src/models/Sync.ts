import axios, { AxiosPromise } from "axios";

interface HasId {
    id?: number;
}
// this is a generic class
// ts doesnt know if the T type will have an ID or not
// to fix this we add this interface
export class Sync<T extends HasId> {

    constructor(public rootUrl: string) { }

    fetch(id: number): AxiosPromise<T> {
        return axios.get(`${this.rootUrl}/${id}`)

    }

    save(data: T): AxiosPromise<T> {
        const { id } = data

        //if user exists, post
        //if user does not exist, put
        if (id) {
            return axios.put(`${this.rootUrl}/${id}`, data)
        } else {
            return axios.post(`${this.rootUrl}`, data)
        }

    }
}