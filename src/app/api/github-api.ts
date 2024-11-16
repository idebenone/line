import { getCacheWithTimestamp, isCacheValid, maintainCache, setCacheWithTimestamp } from "@/lib/cache";
import { Deployments, Event, Repository, User } from "@/lib/types";
import axios from "axios"

/**
 * Method to clear cache.
 * @returns 
 */
export async function clearCache(): Promise<void> {
    return maintainCache(5);
}

/**
 * Github API to fetch user details - without token.
 * @param username 
 * @returns 
 */
export async function fetchUser(username: string): Promise<User> {
    const cacheKey = `user_${username}`;
    const cachedData = await getCacheWithTimestamp(cacheKey);
    if (cachedData.value && isCacheValid(cachedData.timestamp!)) {
        return Promise.resolve(cachedData.value as User)
    } else {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        await setCacheWithTimestamp(cacheKey, response.data);
        return response.data;
    }
}

/**
 * Github API to fetch repositories - without token.
 * @param username 
 * @returns 
 */
export async function fetchRepositories(username: string): Promise<Repository[]> {
    const cacheKey = `repos_${username}`;
    const cachedData = await getCacheWithTimestamp(cacheKey);
    if (cachedData.value && isCacheValid(cachedData.timestamp!)) {
        return Promise.resolve(cachedData.value as Repository[])
    } else {
        const response = await axios.get(`https://api.github.com/users/${username}/repos`);
        await setCacheWithTimestamp(cacheKey, response.data);
        return response.data;
    }
}

/**
 * Github API to fetch activities - without token.
 * @param username 
 * @returns 
 */
export async function fetchEvents(username: string): Promise<Event[]> {
    const cacheKey = `events_${username}`;
    const cachedData = await getCacheWithTimestamp(cacheKey);
    if (cachedData.value && isCacheValid(cachedData.timestamp!)) {
        return Promise.resolve(cachedData.value as Event[])
    } else {
        const response = await axios.get(`https://api.github.com/users/${username}/events?per_page=100`);
        await setCacheWithTimestamp(cacheKey, response.data);
        return response.data;
    }
}

/**
 * Github API to fetch repositories - with token.
 * @param data 
 * @returns 
 */
export async function _fetchRepositories(data: { token: string, user: string }): Promise<Repository[]> {
    const response = await axios.get(`https://api.github.com/users/${data.user}/repos`, {
        headers: {
            "X-GitHub-Api-Version": "2022-11-28",
            "Accept": "application/vnd.github+json",
            authorization: `Bearer ${data.token}`,
        }
    });
    return response.data;
}

/**
 * Github API to fetch deployments - with token.
 * @param data 
 * @returns 
 */
export async function getDeployments(data: { token: string, repo: string, user: string }): Promise<Deployments[]> {
    const response = await axios.get(`https://api.github.com/repos/${data.user}/${data.repo}/deployments`, {
        headers: {
            "X-GitHub-Api-Version": "2022-11-28",
            "Accept": "application/vnd.github+json",
            authorization: `Bearer ${data.token}`,
        }
    })
    return response.data
}

/**
 * Githib API to fetch individual deployment status - with token.
 * @param data 
 * @returns 
 */
export async function getDeploymentStatus(data: { token: string, repo: string, user: string, deployment_id: number, }) {
    const response = await axios.get(`https://api.github.com/repos/${data.user}/${data.repo}/deployments/${data.deployment_id}/statuses`, {
        headers: {
            "X-GitHub-Api-Version": "2022-11-28",
            "Accept": "application/vnd.github+json",
            authorization: `Bearer ${data.token}`,
        }
    })
    return response.data
}

/**
 * Github API to set deployment stat to inactive - with token.
 * @param data 
 * @returns 
 */
export async function setDeploymentInactive(data: { token: string, repo: string, user: string, deployment_id: number }) {
    const response = await axios.post(`https://api.github.com/repos/${data.user}/${data.repo}/deployments/${data.deployment_id}/statuses`, {
        state: 'inactive'
    }, {
        headers: {
            "X-GitHub-Api-Version": "2022-11-28",
            "Accept": "application/vnd.github+json",
            authorization: `Bearer ${data.token}`,
        }
    })
    return response.data
}

/**
 * Github API to delete a deployment - with token.
 * @param data 
 * @returns 
 */
export async function deleteDeployment(data: { token: string, repo: string, user: string, deployment_id: number }): Promise<unknown> {
    const response = await axios.delete(`https://api.github.com/repos/${data.user}/${data.repo}/deployments/${data.deployment_id}`, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/vnd.github.ant-man-preview+json",
            authorization: `Bearer ${data.token}`,
        }
    })
    return response.data
}