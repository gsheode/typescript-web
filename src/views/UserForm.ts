import { User, UserProps } from "../models/User";
import { View } from "./View";


export class UserForm extends View<User, UserProps> {

    eventMap(): { [key: string]: () => void } {
        return {
            'click:.set-age': this.onSetAgeClick,
            'click:.update-name': this.onUpdateName,
            'click:.save-model': this.onSaveClick,
        };
    }

    onUpdateName = (): void => {
        const inputValue = document.querySelector('input');
        this.model.set({ name: inputValue?.value })
    }

    //this is an arrow function so that the value of this can be correct
    onSetAgeClick = (): void => {
        this.model.setRandomAge();
    }

    onSaveClick = (): void => {
        this.model.save();
    }
    template(): string {
        return `
        <div>
            <input placeholder="${this.model.get('name')}" />
            <button class="update-name">Update Name</button>
            <button class="set-age">Set random age</button>
            <button class="save-model">Save</button>

        </div>
        `
    }


}