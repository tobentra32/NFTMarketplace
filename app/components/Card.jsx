const Card = ({ data }) => {
    
  
    return (
      <div className="w-full shadow-xl shadow-black rounded-md overflow-hidden bg-gray-800 my-2 p-3">
        <img
          src={data.image}
          alt={data.title}
          className="h-60 w-full object-cover shadow-lg shadow-black rounded-lg mb-3"
        />
        <h4 className="text-white font-semibold">{data.title}</h4>
        <p className="text-gray-400 text-xs my-1">{data.description}</p>
        <div className="flex justify-between items-center mt-3 text-white">
          <div className="flex flex-col">
            <small className="text-xs">Current Price</small>
            <p className="text-sm font-semibold">{data.price} ETH</p>
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

}

export default Card;