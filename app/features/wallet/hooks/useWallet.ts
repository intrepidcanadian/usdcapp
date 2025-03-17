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

export function useWallet() {
    const [account, setAccount] = useState<Address | null>(null);
    const [address, setAddress] = useState<Address | null>(null);
    const [hash, setHash] = useState<Hash | null>(null);
    const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);
    const [balance, setBalance] = useState<string | null>(null);


    // this creates a public client to interact with the blockchain
    const publicClient = createPublicClient({
        chain: unichainSepolia,
        transport: http()
    })

    const [walletClient, setWalletClient] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const client = createWalletClient({
                chain: unichainSepolia,
                transport: custom(window.ethereum ?? {})
            });
            setWalletClient(client);
        }
    }, []);

    // if there is a hash, we wait for the transaction reciept and set the reciept
    useEffect(() => {
        (async () => {
          if (hash) {
            console.log('Waiting for receipt...');
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            console.log('Receipt received:', receipt);
            setReceipt(receipt);
          }
        })();
    }, [hash]);

    //   if there is a transaction receipt, we want to fetch the balances

    useEffect(() => {
        if (account) {
            fetchBalance(account);
        }
    }, [account]);

    // refreshes the balance of the account everytime there is a receipt of transaction
    useEffect(() => {
        console.log('Balance refresh triggered. Account:', account, 'Receipt:', receipt);
        if (account && receipt) {
            console.log('Fetching new balance...');
            fetchBalance(account);
        }
    }, [receipt, account]);

    // this function fetches the balance of the account
    const fetchBalance = async (address: Address) => {
        console.log('Fetching balance for address:', address);
        const balance = await publicClient.readContract({
            address: USDC_CONTRACT_ADDRESS,
            functionName: 'balanceOf',
            abi: USDC_ABI,
            args: [address],
        });

        const formattedBalance = (Number(balance) / 10 ** 6).toFixed(2);
        console.log('New balance:', formattedBalance);
        setBalance(formattedBalance);
    }

    const connect = async () => {
        if (!walletClient) return;

        const [address] = await walletClient.requestAddresses();
        setAccount(address);
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