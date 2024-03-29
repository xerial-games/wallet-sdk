interface Wallet {
    address: string,
    smartAccount?: string,
    custodial: boolean
}

export interface User {
    identifier: string,
    name?: string
    wallets: Wallet[]
}

export type Chain = "polygon" | "telos";

export type ResolveAuth = (user: User) => void;

export type RejectAuth = (error: any) => void;

export interface Config {
    projectId: string;
    chain: Chain;
    production?: boolean;
}