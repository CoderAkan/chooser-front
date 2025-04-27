import { filterTask } from "../types/type"

export const tasks = {
    getTask(taskData: filterTask) {
        const data = {
            title: "Do this",
            description: "You need to do this or that"
        } //await instance.get();
        return data;
    }
}