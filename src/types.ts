declare global {
    interface Window {
        ethereum?: any;
    }
}

export type Chain = "polygon" | "telos";

export type ResolveAuth = (user: any) => void;

export type RejectAuth = (error: any) => void;

export interface Config {
    projectId: string;
    chain: Chain;
    production?: boolean;
}