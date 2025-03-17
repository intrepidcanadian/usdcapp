import { useState, useEffect } from "react";

declare global {
    interface Window {
        ethereum: any;
    }
}

import { 
    http,
    createPublicClient,
    createWalletClient,
    custom,
    encodeFunctionData
} from 'viem';

import { unichainSepolia} from 'viem/chains';

import type { Address, Hash, TransactionReceipt } from 'viem';

import { USDC_CONTRACT_ADDRESS, USDC_ABI } from '../constants/contracts';

// this creates a public client to interact with the blockchain
const publicClient = createPublicClient({
    chain: unichainSepolia,
    transport: http()
})

// this creates a wallet client to interact with the blockchain
const walletClient = createWalletClient({
    chain: unichainSepolia,
    transport: custom(window.ethereum ?? {})
})

export function useWallet() {
    const [account, setAccount] = useState<Address | null>(null);
    const [address, setAddress] = useState<Address | null>(null);
    const [hash, setHash] = useState<Hash | null>(null);
    const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);
    const [balance, setBalance] = useState<string | null>(null);

    // if there is a hash, we wait for the transaction reciept and set the reciept
    useEffect(() => {
        (async () => {
          if (hash) {
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            setReceipt(receipt);
          }
        })();
      }, [hash]);

    //   if there is a transaction receipt, we want to fetch the balances

    // refreshes the balance of the account everytime there is a receipt of transaction
    useEffect(() => {
      if (account && receipt) {
        fetchBalance(account);
      }
    }, [receipt]);

    // this function fetches the balance of the account
    const fetchBalance = async (address: Address) => {
        const balance = await publicClient.readContract({
            address: USDC_CONTRACT_ADDRESS,
            functionName: 'balanceOf',
            abi: USDC_ABI,
            args: [address],
        });

        const formattedBalance = (Number(balance) / 10 ** 6).toFixed(2);
        setBalance(formattedBalance);
    }

    const connect = async () => {
        const [address] = await walletClient.requestAddresses();
        setAccount(address);
        await fetchBalance(address);
    }
    

    // this function is used to send transactions
    const sendTransaction = async (to: Address, value: string) => {
        if (!account) return;

        const valueinWei = BigInt(parseFloat(value) * 10 ** 6);

        const data = encodeFunctionData({
            abi: USDC_ABI,
            functionName: 'transfer',
            args: [to, valueinWei]
        })

        // send the transaction using the wallet client
        const hash = await walletClient.sendTransaction({
            account: account,
            to: USDC_CONTRACT_ADDRESS,
            data: data,
        });

        setHash(hash);
    };

    return {
        account: account,
        balance: balance,
        receipt: receipt,
        connect: connect,
        sendTransaction: sendTransaction,
    }
}