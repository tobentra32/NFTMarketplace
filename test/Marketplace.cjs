
// We import Chai to use its asserting functions here.
const { expect } = require("chai");

const { ethers } = require("hardhat");

// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies your tests and makes them run faster, by taking
// advantage of Hardhat Network's snapshot functionality.
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

// `describe` is a Mocha function that allows you to organize your tests.
// Having your tests organized makes debugging them easier. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe("NFTMarketplace contract", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployMarketplaceFixture() {
    // Get the Signers here.
    const [owner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call ethers.deployContract and await
    // its waitForDeployment() method, which happens once its transaction has been
    // mined.
    const nftMarketplace = await ethers.deployContract("NFTMarketplace");

    await nftMarketplace.waitForDeployment();





    // Fixtures can return anything you consider useful for your tests
    return { nftMarketplace, owner, addr1, addr2 };
  }

  it("Should update the listing price", async function () {
    const { nftMarketplace, owner, addr1, addr2  } = await loadFixture(deployMarketplaceFixture);

    const newListingPrice = ethers.parseEther("0.05");
    await nftMarketplace.updateListingPrice(newListingPrice);
    expect(await nftMarketplace.getListingPrice()).to.equal(newListingPrice);
  }); 

  it("Should set the right owner", async function () {
    const { nftMarketplace, owner, addr1, addr2  } = await loadFixture(deployMarketplaceFixture);
    expect(await nftMarketplace.getOwner()).to.equal(owner.address);
  });

  it("Should set the initial listing price", async function () {
    const { nftMarketplace, owner, addr1, addr2  } = await loadFixture(deployMarketplaceFixture);
    const listingPrice = await nftMarketplace.getListingPrice();
    expect(listingPrice).to.equal(ethers.parseEther("0.025"));
  });

  it("Should allow owner to update listing price", async function () {
    const { nftMarketplace, owner, addr1, addr2  } = await loadFixture(deployMarketplaceFixture);

    await nftMarketplace.updateListingPrice(ethers.parseEther("0.05"));
    expect(await nftMarketplace.getListingPrice()).to.equal(
      ethers.parseEther("0.05")
    );
  });

  it("Should fail if non-owner tries to update listing price", async function () {
    const { nftMarketplace, owner, addr1, addr2  } = await loadFixture(deployMarketplaceFixture);
    await expect(
      nftMarketplace.connect(addr1).updateListingPrice(ethers.parseEther("0.05"))
    ).to.be.revertedWith("Only marketplace owner can update listing price.");
  });



  it("Should mint a token and list it", async function () {
    const { nftMarketplace, owner, addr1, addr2  } = await loadFixture(deployMarketplaceFixture);
    const tokenURI = "https://test-token.com";
    const price = ethers.parseEther("1");
    const title = "test title";
    const description = "test description";


    await nftMarketplace.connect(addr1).createToken(tokenURI, price, title, description, {
      value: ethers.parseEther("0.025"),
    });

    const marketItems = await nftMarketplace.fetchMarketItems();
    expect(marketItems.length).to.equal(1);
    expect(marketItems[0].tokenId).to.equal(1);
    expect(marketItems[0].price).to.equal(price);
  });

  it("Should fail if incorrect listing price is provided", async function () {
    const { nftMarketplace, owner, addr1, addr2  } = await loadFixture(deployMarketplaceFixture);
    const tokenURI = "https://test-token.com";
    const price = ethers.parseEther("1");
    const title = "test title";
    const description = "test description";

    await expect(
      nftMarketplace.connect(addr1).createToken(tokenURI, price, title, description, {
        value: ethers.parseEther("0.01"),
      })
    ).to.be.revertedWith("Price must be equal to listing price");
  });

  it("Should complete a market sale", async function () {
    const { nftMarketplace, owner, addr1, addr2  } = await loadFixture(deployMarketplaceFixture);

    await nftMarketplace.connect(addr1).createToken("https://test-token.com", ethers.parseEther("1"), "test title", "test description", {
        value: ethers.parseEther("0.025"),
    });

    await nftMarketplace.connect(addr2).createMarketSale(1, {
      value: ethers.parseEther("1"),
    });

    const marketItems = await nftMarketplace.fetchMarketItems();
    expect(marketItems.length).to.equal(0);

    const myNFTs = await nftMarketplace.connect(addr2).fetchMyNFTs();
    expect(myNFTs.length).to.equal(1);
  });

  it("Should fail if payment is incorrect", async function () {

    const { nftMarketplace, owner, addr1, addr2  } = await loadFixture(deployMarketplaceFixture);
    
    await nftMarketplace.connect(addr1).createToken("https://test-token.com", ethers.parseEther("1"), "test title", "test description", {
        value: ethers.parseEther("0.025"),
    });
    await expect(
      nftMarketplace.connect(addr2).createMarketSale(1, {
        value: ethers.parseEther("0.5"),
      })
    ).to.be.revertedWith("Please submit the asking price in order to complete the purchase");
  });

  it("Should fail if price is not met", async function () {
    const { nftMarketplace, owner, addr1, addr2, addr3 } = await loadFixture(deployMarketplaceFixture);
    await nftMarketplace.connect(addr1).createToken("https://test-token.com", ethers.parseEther("1"), "test title", "test description", {
        value: ethers.parseEther("0.025"),
    });

    await expect(nftMarketplace.connect(addr2).createMarketSale(1, {
        value: ethers.parseEther("0.5"),
    })).to.be.revertedWith("Please submit the asking price in order to complete the purchase");
  });


  it("Should allow token owner to resell", async function () {

    const { nftMarketplace, owner, addr1, addr2, addr3 } = await loadFixture(deployMarketplaceFixture);

    await nftMarketplace.connect(addr1).createToken("https://test-token.com", ethers.parseEther("1"), "test title", "test description", {
        value: ethers.parseEther("0.025"),
    });

    await nftMarketplace.connect(addr2).createMarketSale(1, {
        value: ethers.parseEther("1"),
    });
    await nftMarketplace.connect(addr2).resellToken(1, ethers.parseEther("2"), {
        value: ethers.parseEther("0.025"),
    });

    const marketItems = await nftMarketplace.fetchMarketItems();
    expect(marketItems.length).to.equal(1);
    expect(marketItems[0].price).to.equal(ethers.parseEther("2"));
  });

  it("Should fail if non-owner tries to resell", async function () {

    const { nftMarketplace, owner, addr1, addr2, addr3 } = await loadFixture(deployMarketplaceFixture);

    await nftMarketplace.connect(addr1).createToken("https://test-token.com", ethers.parseEther("1"), "test title", "test description", {
        value: ethers.parseEther("0.025"),
    });

    await nftMarketplace.connect(addr2).createMarketSale(1, {
        value: ethers.parseEther("1"),
    });
    await expect(
        nftMarketplace.connect(addr1).resellToken(1, ethers.parseEther("2"), {
        value: ethers.parseEther("0.025"),
    })
  ).to.be.revertedWith("Only item owner can perform this operation");
  });

  it("Should fetch market items", async function () {

    const { nftMarketplace, owner, addr1, addr2, addr3 } = await loadFixture(deployMarketplaceFixture);

    await nftMarketplace.connect(addr1).createToken("https://test-token1.com", ethers.parseEther("1"), "test title", "test description", {
      value: ethers.parseEther("0.025"),
    });

    await nftMarketplace.connect(addr2).createToken("https://test-token2.com", ethers.parseEther("2"), "test title2", "test description2", {
      value: ethers.parseEther("0.025"),
    });

    await nftMarketplace.connect(addr2).createMarketSale(1, {
      value: ethers.parseEther("1"),
    });
    const marketItems = await nftMarketplace.fetchMarketItems();
    expect(marketItems.length).to.equal(1);
  });

  it("Should fetch user's NFTs", async function () {
    const { nftMarketplace, owner, addr1, addr2, addr3 } = await loadFixture(deployMarketplaceFixture);
    await nftMarketplace.connect(addr1).createToken("https://test-token1.com", ethers.parseEther("1"), "test title", "test description",{
      value: ethers.parseEther("0.025"),
    });

    await nftMarketplace.connect(addr2).createToken("https://test-token2.com", ethers.parseEther("2"), "test title2", "test description2",{
      value: ethers.parseEther("0.025"),
    });

    await nftMarketplace.connect(addr2).createMarketSale(1, {
      value: ethers.parseEther("1"),
    });
    const myNFTs = await nftMarketplace.connect(addr2).fetchMyNFTs();
    expect(myNFTs.length).to.equal(1);
  });




});