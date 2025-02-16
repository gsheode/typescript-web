import { HasId, Model } from "../models/Model";

export abstract class View<T extends Model<K>, K extends HasId> {
    constructor(public parent: Element, public model: T) {
        this.bindModel();
    }

    abstract eventMap(): { [key: string]: () => void }
    abstract template(): string;
    bindModel(): void {
        this.model.on('change', () => {
            this.render();
        })
    }

    bindEvents(fragements: DocumentFragment): void {
        const eventMap = this.eventMap();

        for (let eventKey in eventMap) {
            const [eventName, selector] = eventKey.split(':');
            fragements.querySelectorAll(selector).forEach((element) => {
                // when the event click happens on an element eg: click: button
                // perfom the fucntion eventMap[eventKey] i.e onButtonClick
                element.addEventListener(eventName, eventMap[eventKey]);
            })
        }

    }
    render(): void {
        this.parent.innerHTML = '';
        const templateElement = document.createElement('template');
        templateElement.innerHTML = this.template();
        this.bindEvents(templateElement.content);
        this.parent.append(templateElement.content);
    }
}