"use client"
import { useRouter } from 'next/navigation'
import Identicon from 'react-identicons'



const Hero = () => {
  const router = useRouter();
  const createNFT = () => {
    router.push('/createNft');
  }
  const create = () => {
    router.push('/createNft');
  }
  


return (
  <div
    className="flex flex-col md:flex-row w-4/5 justify-between
    items-center mx-auto py-10"
  >
    <div className="md:w-3/6 w-full">
      <div>
        <h1 className="text-white text-5xl font-bold">
          Buy and Sell <br /> Digital Arts, <br />
          <span className="text-gradient">NFTs</span> Collections
        </h1>
        <p className="text-gray-500 font-semibold text-sm mt-3">
          Mint and collect the hottest NFTs around.
        </p>
      </div>

      <div className="flex flex-row mt-5">
        <button
          className="shadow-xl shadow-black text-white
          bg-[#e32970] hover:bg-[#bd255f]
          rounded-full cursor-pointer p-2" onClick={createNFT}
        >
          Create NFT
        </button>
        
      </div>

      <div className="w-3/4 flex justify-between items-center mt-5">
        <div>
          <p className="text-white font-bold">1231k</p>
          <small className="text-gray-300">User</small>
        </div>
        <div>
          <p className="text-white font-bold">152k</p>
          <small className="text-gray-300">Artwork</small>
        </div>
        <div>
          <p className="text-white font-bold">200k</p>
          <small className="text-gray-300">Artist</small>
        </div>
      </div>
    </div>

    <div
      className="shadow-xl shadow-black md:w-2/5 w-full
    mt-10 md:mt-0 rounded-md overflow-hidden bg-gray-800"
    >
      <img
        src="https://images.cointelegraph.com/images/1434_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS91cGxvYWRzLzIwMjEtMDYvNGE4NmNmOWQtODM2Mi00YmVhLThiMzctZDEyODAxNjUxZTE1LmpwZWc=.jpg"
        alt="NFT Art"
        className="h-60 w-full object-cover"
      />
      <div className="flex justify-start items-center p-3">
        <Identicon
          string={'gbgdfjmghj'}
          size={50}
          className="h-10 w-10 object-contain rounded-full mr-3"
        />
        <div>
          <p className="text-white font-semibold">0xe1...2d3f</p>
          <small className="text-pink-800 font-bold">@you</small>
        </div>
      </div>
    </div>
  </div>
)
}

export default Hero