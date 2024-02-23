import { Chain, ResolveAuth, RejectAuth, Config, User } from "./types";
import { UnsignedTransaction } from 'ethers';

class Xerial {
    projectId: string
    chain: Chain
    private loginPopup: Window | null
    private walletAuthHost: string
    private walletApiHost: string
    private resolveAuth: ResolveAuth | null
    private rejectAuth: RejectAuth | null

    constructor({ projectId, chain, production = false }: Config) {
        this.projectId = projectId;
        this.chain = chain
        this.loginPopup = null;
        this.walletAuthHost = production ? "https://wallet.xerial.io/auth" : "https://wallet.staging.xerial.io/auth"
        this.walletApiHost = production ? "https://wallet.xerial.io/api" : "https://wallet.staging.xerial.io/api"
        this.resolveAuth = null
        this.rejectAuth = null
    }

    auth() {
        const xerialTokens = localStorage.getItem("xerial")
        if (xerialTokens && Date.parse(JSON.parse(xerialTokens).refresh.expires) > Date.now()) {
            this.refreshTokens(JSON.parse(xerialTokens).refresh.token)
        } else {
            const authUrl = `${this.walletAuthHost}?projectId=${this.projectId}`;
            const width = 480;
            const height = 565;
            const left = (window.innerWidth - width) / 2;
            const top = (window.innerHeight - height) / 2;
            this.loginPopup = window.open(authUrl, 'xerialAuthPopup', `width=${width}, height=${height}, left=${left}, top=${top}`);
            window.addEventListener('message', this.handleLogin.bind(this));
        }
        return new Promise((resolve, reject) => {
            this.resolveAuth = resolve;
            this.rejectAuth = reject;
        });
    }

    private async handleLogin(event: MessageEvent) {
        if (event.source === this.loginPopup && event.data.access) {
            localStorage.setItem("xerial", JSON.stringify(event.data));
            this.loginPopup?.close();
            window.removeEventListener('message', this.handleLogin);
            const user = await this.user()
            if (user) {
                this.resolveAuth?.(user);
            } else {
                this.rejectAuth?.("Auth Failed")
            }
        }
    }

    private async refreshTokens(refreshToken: string) {
        try {
            const res = await fetch(`${this.walletApiHost}/auth/refresh-tokens`, {
                method: "POST", headers: this.getHeaders(true), body: JSON.stringify({ refreshToken })
            })
            if (res.status === 401) {
                localStorage.removeItem("xerial")
                throw new Error;
            }
            const tokens = await res.json()
            localStorage.setItem("xerial", JSON.stringify(tokens));
            const user = await this.user()
            if (user) {
                this.resolveAuth?.(user);
            }
        } catch (error) {
            this.rejectAuth?.("Auth Failed")
        }

    }

    getHeaders(auth: boolean) {
        const xerialTokens = localStorage.getItem("xerial")
        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        if (xerialTokens && auth) {
            headers.append("Authorization", `Bearer ${JSON.parse(xerialTokens).access.token}`)
        }
        return headers
    }

    isAuth() {
        const xerialTokens = localStorage.getItem("xerial")
        if (xerialTokens) {
            if (Date.parse(JSON.parse(xerialTokens).access.expires) > Date.now()) {
                return true
            }
        }
        return false
    }

    async logout() {
        const xerialTokens = localStorage.getItem("xerial")
        if (xerialTokens) {
            try {
                await fetch(`${this.walletApiHost}/auth/logout`, {
                    method: "POST", headers: this.getHeaders(false), body: JSON.stringify({ refreshToken: JSON.parse(xerialTokens).refresh.token })
                })
                localStorage.removeItem("xerial")
            } catch (error) {
                throw error
            }
        }
    }

    async user(): Promise<User> {
        try {
            const res = await fetch(`${this.walletApiHost}/user`, {
                method: "GET", headers: this.getHeaders(true)
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
                method: "GET", headers: this.getHeaders(false)
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
                method: "GET", headers: this.getHeaders(false)
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
                method: "GET", headers: this.getHeaders(false)
            })
            return res.json()
        } catch (error) {
            throw error
        }
    }

    async sendTransaction(tx: UnsignedTransaction, from: string) {
        try {
            const user = await this.user()
            if (user?.wallets[0].address !== from && user?.wallets[0].smartAccount !== from) {
                throw new Error("Unauthorized");
            }
            if (user?.wallets[0].custodial) {
                const res = await fetch(`${this.walletApiHost}/wallet/${from}/${this.chain}/transaction`, {
                    method: "POST", headers: this.getHeaders(true), body: JSON.stringify(tx)
                })
                if (res.status === 401) {
                    throw new Error("Not Authenticated");
                }
                const { transactionHash } = await res.json()
                return transactionHash
            } else {
                throw new Error("Metamask Wallet");
            }
        } catch (error) {
            throw error
        }
    }
}

export default Xerial;