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
        pull_request?: {
            title: string;
            body: string;
            html_url: string;
            base: { repo: { html_url: string } };
        };
        commits?: { sha: string; message: string; url: string }[];
    };
}