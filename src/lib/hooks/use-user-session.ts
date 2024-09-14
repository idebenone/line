import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";

import { fetchUser } from "@/app/api/github-api";
import { userAtom } from "@/lib/atoms";
import { User } from "../types";


const useUserSession = () => {
    const setUser = useSetAtom(userAtom);
    const router = useRouter();

    async function handleFetchGitHubUser(username: string) {
        try {
            const response = await fetchUser(username);
            setUser(response);
            router.push(`/edit/${response.login}`)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const username = localStorage.getItem("username");
        if (!username) {
            router.push("/")
        } else {
            handleFetchGitHubUser(username)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updateUser = (newUser: User) => {
        setUser(newUser);
    };

    return { updateUser };
};

export default useUserSession;
