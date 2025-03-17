'use client'

import { useRef, useState } from "react"

// this is the UX components for the wallet interface
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Wallet } from "lucide-react"

import { useWallet } from "../hooks/useWallet"
import type { Address } from "viem"

const bigIntReplacer = (_key: string, value: any) => {
    if (typeof value === 'bigint') {
        return value.toString();
    }

    return value;
}

export default function WalletInterface() {
    const { account, balance, connect, receipt, sendTransaction } = useWallet();

    const addressInput = useRef<HTMLInputElement>(null);
    const valueInput = useRef<HTMLInputElement>(null);

    const handleSendTransaction = () => {
        if (!addressInput.current || !valueInput.current) return;

        sendTransaction(
            addressInput.current.value as Address,
            valueInput.current.value
        )
    }

    return (

        <div className = "min-h-screen bg-black p-4">
            <div className = "max-w-md mx-auto space-y-4">
                <div className = "bg-[#1c1c1c] text-green-500 p-2 rounded-lg text-sm flex items-center gap-2">
                    You are in test mode
                </div>
            </div>
        </div>
            // <div>
            //     <div>
            //         < Wallet / >
            //     </div>

            //     <CardContent>
            //         <Button
            //             onClick={connect}
            //         >
            //             Connect Wallet
            //         </Button>
            //     </CardContent>
            // </div>
    )

}