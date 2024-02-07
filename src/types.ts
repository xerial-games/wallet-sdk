declare global {
    interface Window {
        ethereum?: any;
    }
}

export type Chain = "polygon" | "telos";

export type ResolverFunction = (user: any) => void;

export interface Config {
    projectId: string;
    chain: Chain;
    production?: boolean;
}