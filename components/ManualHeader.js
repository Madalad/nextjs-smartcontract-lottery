import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function ManualHeader() {
    // let web3Enabled = false
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis() // hook

    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
        //enableWeb3()
    }, [isWeb3Enabled])
    // automatically runs on load
    // then runs checking the value
    // no dependency array = run anytime something re-renders
    // be CAREFUL! can get circular renders
    // dependency array nonempty = run anytime any element changes

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                // then we disconnected
                window.localStorage.removeItem("connected")
                deactivateWeb3() // sets isWeb3Enabled to false
                console.log("Null account found")
            }
        })
    }, [])

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "injected")
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    )
}
