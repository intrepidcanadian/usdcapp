import { WalletInterface, SecondWalletInterface } from "./features/wallet/components/WalletInterface"


export default function Home () {
  return (
    <main> 
      <WalletInterface/>
      <SecondWalletInterface/>
    </main>
  )
}