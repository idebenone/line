import axios, { AxiosResponse } from "axios"

export function fetchUser(username: string): Promise<AxiosResponse> {
    return axios.get(`https://api.github.com/users/${username}`)
}

export function fetchRepositories(username: string): Promise<AxiosResponse> {
    return axios.get(`https://api.github.com/users/${username}/repos`)
} 