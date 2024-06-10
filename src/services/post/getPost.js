import { axiosInstance } from "@/lib/axios";


export const getPosts =  (payload) => {
    console.log(payload)
    return axiosInstance({
        url: `post`,
        method: 'get',
        ...payload
    })
}

export const getComment =  (id, payload = {}) => {
    return axiosInstance({
        url: `post/${id}/comment`,
        method: 'get',
        ...payload
    })
}

export const postComment =  (payload) => {
    return axiosInstance({
        url: `comment/create`,
        method: 'post',
        ...payload
    })
}


export const deleteComment =  (id) => {
    return axiosInstance({
        url: `comment/${id}`,
        method: 'delete',
    })
}