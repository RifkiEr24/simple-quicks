import { axiosInstanceTodo } from "@/lib/axios";


export const getTodos =  (payload = {}) => {
    return axiosInstanceTodo({
        url: `users/2/todos`,
        method: 'get',
        ...payload
    })
}