
import { ConnectButton } from './connectButton'
import Link from 'next/link'


const Header = () => {

return (
  <nav className="w-4/5 flex md:justify-center justify-between items-center py-4 mx-auto">
    <div className="md:flex-[0.5] flex-initial justify-center items-center">
      <img
        className="w-32 cursor-pointer"
        src= ""
        alt="Timeless Logo"
      />
    </div>

    <ul
      className="md:flex-[0.5] text-white md:flex
      hidden list-none flex-row justify-between
      items-center flex-initial"
    >
      <li className="mx-4 cursor-pointer"><Link href="/marketplace">Marketplace</Link></li>
      

      <li className="mx-4 cursor-pointer"><Link href="/createNft">Create Nft</Link></li>
      <li className="mx-4 cursor-pointer"><Link href="/dashboard">MyNfts</Link></li>
      <li className="mx-4 cursor-pointer">Community</li>
    </ul>

    

      <ConnectButton />
  </nav>
)
}

export default Header