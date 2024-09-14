import { getCacheWithTimestamp, isCacheValid, setCacheWithTimestamp } from "@/lib/cache";
import { Event, Repository, User } from "@/lib/types";
import axios from "axios"

export async function fetchUser(username: string): Promise<User> {
    const cachedData = await getCacheWithTimestamp("user");
    if (cachedData.value && isCacheValid(cachedData.timestamp!)) {
        return Promise.resolve(cachedData.value as User)
    } else {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        await setCacheWithTimestamp("user", response.data);
        return response.data;
    }
}

export async function fetchRepositories(username: string): Promise<Repository[]> {
    const cachedData = await getCacheWithTimestamp("repos");
    if (cachedData.value && isCacheValid(cachedData.timestamp!)) {
        return Promise.resolve(cachedData.value as Repository[])
    } else {
        const response = await axios.get(`https://api.github.com/users/${username}/repos`);
        await setCacheWithTimestamp("repos", response.data);
        return response.data;
    }
}

export async function fetchEvents(username: string): Promise<Event[]> {
    const cachedData = await getCacheWithTimestamp("events");
    if (cachedData.value && isCacheValid(cachedData.timestamp!)) {
        return Promise.resolve(cachedData.value as Event[])
    } else {
        const response = await axios.get(`https://api.github.com/users/${username}/events?per_page=100`);
        await setCacheWithTimestamp("events", response.data);
        return response.data;
    }
}