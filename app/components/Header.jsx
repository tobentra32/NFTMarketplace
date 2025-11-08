"use client"
import { useGlobalState } from '../store'
import { ConnectButton } from './connectButton'
import Link from 'next/link'
import Image from "next/image";





const Header = () => {

  const [connectedAccount] = useGlobalState('connectedAccount')

return (
  <nav className="w-4/5 flex md:justify-center justify-between items-center py-4 mx-auto">
    <div className="md:flex-[0.5] flex-initial justify-center items-center">
      <Image
        className="w-32 cursor-pointer"
        src="/nftlogo.jpg"
        alt="NFTMarketplace"
        width={128}
        height={128}
        priority
      />
    </div>

    <ul
      className="md:flex-[0.5] text-white md:flex
      hidden list-none flex-row justify-between
      items-center flex-initial"
    >
      <li className="mx-4 cursor-pointer"><Link href="/dashboard">Dashboard</Link></li>
      

      
      <li className="mx-4 cursor-pointer"><Link href="/myNFT">MyNfts</Link></li>
      <li className="mx-4 cursor-pointer">Community</li>
    </ul>

    

      <ConnectButton />
  </nav>
)
}

export default Header