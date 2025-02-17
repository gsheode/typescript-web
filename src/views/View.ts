import { HasId, Model } from "../models/Model";

export abstract class View<T extends Model<K>, K extends HasId> {
    regions: { [keys: string]: Element } = {}
    constructor(public parent: Element, public model: T) {
        this.bindModel();
    }

    abstract template(): string;

    regionsMap(): { [key: string]: string } {
        return {}
    }

    // not abstract because abstract methods are required to be implmeneted by any classes that extend the View class
    // this way of return {} ensure that it isnt a required field
    eventMap(): { [key: string]: () => void } {
        return {}
    }

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

    mapRegions(fragement: DocumentFragment): void {
        const regionsMap = this.regionsMap();

        for (let key in regionsMap) {
            const selector = regionsMap[key];
            const element = fragement.querySelector(selector);
            if (element) {
                this.regions[key] = element;
            }
        }

    }

    onRender(): void {

    }
    render(): void {
        this.parent.innerHTML = '';
        const templateElement = document.createElement('template');
        templateElement.innerHTML = this.template();
        this.bindEvents(templateElement.content);

        this.mapRegions(templateElement.content);

        this.onRender()

        this.parent.append(templateElement.content);
    }
}