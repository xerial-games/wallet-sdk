declare global {
    interface Window {
        ethereum?: any;
    }
}

export type Chain = "polygon" | "telos";

export type ResolverFunction = (user: User) => void;

export interface User {
    address: string;
    custodial: boolean;
}

export interface Config {
    projectId: string;
    chain: Chain;
    production?: boolean;
}