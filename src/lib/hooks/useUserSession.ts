import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";

import { User } from "@supabase/supabase-js";
import { userAtom } from "@/lib/atoms";

const useUserSession = () => {
    const setUser = useSetAtom(userAtom);
    const router = useRouter();

    async function handleFetchGitHubUser(username: string) {
        try {
            const data = await fetch(`https://api.github.com/users/${username}`, {
                method: "GET",
                headers: [["content-type", "application/json"]],
            })
            data.json().then(data => {
                setUser(data);
                router.push(`/preview/${data.login}`)
            })
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
    }, [])

    const updateUser = (newUser: User) => {
        setUser(newUser);
    };

    return { updateUser };
};

export default useUserSession;
