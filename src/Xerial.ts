import { ethers } from "ethers"
import { Deferrable } from "ethers/lib/utils";
import { Chain, ResolverFunction, Config } from "./types";

class Xerial {
    projectId: string
    chain: Chain
    private loginPopup: Window | null
    private walletAuthHost: string
    private walletApiHost: string
    private resolveAuth: ResolverFunction | null

    constructor({ projectId, chain, production = false } : Config) {
        this.projectId = projectId;
        this.chain = chain
        this.loginPopup = null;
        this.walletAuthHost = production ? "https://wallet.xerial.io/auth" : "https://wallet.staging.xerial.io/auth"
        this.walletApiHost = production ? "https://wallet.xerial.io/api" : "https://wallet.staging.xerial.io/api"
        this.resolveAuth = null
    }

    auth() {
        const authUrl = `${this.walletAuthHost}?projectId=${this.projectId}`;
        const width = 475;
        const height = 560;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        this.loginPopup = window.open(authUrl, 'xerialAuthPopup', `width=${width}, height=${height}, left=${left}, top=${top}`);
        window.addEventListener('message', this.handleLogin.bind(this));
        return new Promise((resolve) => {
            this.resolveAuth = resolve;
        });
    }

    async handleLogin(event: MessageEvent) {
        if (event.source === this.loginPopup && event.data.access) {
            localStorage.setItem("accessToken", event.data.access.token);
            this.loginPopup?.close();
            window.removeEventListener('message', this.handleLogin);
            const user = await this.user()
            if (user && this.resolveAuth) {
                this.resolveAuth(user);
            }
        }
    }

    getHeaders() {
        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
    }

    async user() {
            try {
                const res = await fetch(`${this.walletApiHost}/user`, {
                    method: "GET", headers: this.getHeaders()
                })
                if (res.status === 401) {
                    throw new Error("Not Authenticated");
                }
                return res.json()
            } catch (error) {
                throw error
            }
    }

    async tokens(address: string) {
        try {
            const res = await fetch(`${this.walletApiHost}/wallet/${address}/${this.chain}/tokens`, {
                method: "GET", headers: this.getHeaders()
            })
            const { balances } = await res.json()
            return balances
        } catch (error) {
            throw error
        }
    }

    async eth(address: string) {
        try {
            const res = await fetch(`${this.walletApiHost}/wallet/${address}/${this.chain}/eth`, {
                method: "GET", headers: this.getHeaders()
            })
            const { balance } = await res.json()
            return balance
        } catch (error) {
            throw error
        }
    }

    async inventory(address: string) {
        if (this.chain !== "polygon") {
            throw new Error('Not supported chain');
        }
        try {
            const res = await fetch(`${this.walletApiHost}/wallet/${address}/${this.chain}/global-inventory`, {
                method: "GET", headers: this.getHeaders()
            })
            return res.json()
        } catch (error) {
            throw error
        }
    }

    async sendTransaction(tx: Deferrable<ethers.providers.TransactionRequest>, from: string) {
        try {
            const user = await this.user()
            if (user?.wallets[0].address !== from || user?.wallets[0].smartAccount !== from) {
                throw new Error("Unauthorized");
            }
            if (user?.wallets[0].custodial) {
                const res = await fetch(`${this.walletApiHost}/wallet/${from}/${this.chain}/transaction`, {
                    method: "POST", headers: this.getHeaders(), body: JSON.stringify(tx)
                })
                if (res.status === 401) {
                    throw new Error("Not Authenticated");
                }
                const { transactionHash } = await res.json()
                return transactionHash
            } else {
                if (!window.ethereum) {
                    throw new Error("Metamask is not installed")
                }
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                if (address !== from) {
                    throw new Error("Incorrect account")
                }
                const txInfo = await signer.sendTransaction(tx);
                await txInfo.wait()
                return txInfo.hash
            }
        } catch (error) {
            throw error
        }
    }
}

export default Xerial;