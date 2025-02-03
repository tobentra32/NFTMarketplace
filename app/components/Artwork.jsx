const Artworks = () => {
  return (
    <div className="bg-[#151c25] gradient-bg-artworks">
      <div className="w-4/5 py-10 mx-auto">
        <h4 className="text-white text-3xl font-bold uppercase text-gradient">
          Latest Artworks
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-4 lg:gap-3 py-2.5">
          {Array(4)
            .fill()
            .map((nft, i) => (
              <Card key={i + 1} nft={i + 1} />
            ))}
        </div>
        <div className="text-center my-5">
          <button
            className="shadow-xl shadow-black text-white
            bg-[#e32970] hover:bg-[#bd255f]
            rounded-full cursor-pointer p-2"
          >
            Load More
          </button>
        </div>
      </div>
    </div>
  )
  }

  const Card = ({ nft }) => (
  <div className="w-full shadow-xl shadow-black rounded-md overflow-hidden bg-gray-800 my-2 p-3">
    <img
      src="https://images.cointelegraph.com/images/1434_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS91cGxvYWRzLzIwMjEtMDYvNGE4NmNmOWQtODM2Mi00YmVhLThiMzctZDEyODAxNjUxZTE1LmpwZWc=.jpg"
      alt={'Artwork'}
      className="h-60 w-full object-cover shadow-lg shadow-black rounded-lg mb-3"
    />
    <h4 className="text-white font-semibold">NFT #{nft}</h4>
    <p className="text-gray-400 text-xs my-1">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reiciendis illum
      sequi rem impedit fugit illo.
    </p>
    <div className="flex justify-between items-center mt-3 text-white">
      <div className="flex flex-col">
        <small className="text-xs">Current Price</small>
        <p className="text-sm font-semibold">0.34 ETH</p>
      </div>

      <button
        className="shadow-lg shadow-black text-white text-sm bg-[#e32970]
            hover:bg-[#bd255f] cursor-pointer rounded-full px-1.5 py-1"
      >
        View Details
      </button>
    </div>
  </div>
  )

  export default Artworks