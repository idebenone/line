export type User = {
    login: string,
    name: string,
    avatar_url: string,
    html_url: string
}

export type Repository = {
    id: number,
    type: string,
    html_url: string,
    name: string,
    description: string,
    language?: string,
    stargazers_count: number
    updated_at: string
}

export type Event = {
    id: string;
    type: string;
    repo: { name: string };
    payload: {
        action: string;
        head: string;
        pull_request?: {
            title: string;
            body: string;
            html_url: string;
            base: { repo: { html_url: string } };
            state: string;
            merged_at: string | null;
            created_at: string
        };
        commits?: { sha: string; message: string; url: string }[];
    };
    created_at: string
}

export type Deployments = {
    id: number,
    created_at: string,
    creator: {
        avatar_url: string
    },
    ref: string
}