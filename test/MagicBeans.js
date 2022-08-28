const { expect } = require("chai");
const { ethers } = require("hardhat");
const provider = ethers.provider;

describe("MagicBeans", function () {
  let owner, buyer, magicBeans;

  beforeEach(async function () {
    [owner, buyer] = await ethers.getSigners()

    const MagicBeans = await ethers.getContractFactory("MagicBeans", owner)
    magicBeans = await MagicBeans.deploy()
    await magicBeans.deployed()
  })

  it("sets owner", async function() {
    const currentOwner = await magicBeans.owner()
    expect(currentOwner).to.eq(owner.address)
  })

  it("buyer has no beans for sale yet", async function () {
    await expect(
      magicBeans.connect(buyer).sellHarvest()
    ).to.be.revertedWith("You have not Beans for sale!");
  });

  it("buyer should has 9.5 beans planted", async function () {
    const amount = new ethers.BigNumber.from(10).pow(16).mul(100);
    const expectedBalance = new ethers.BigNumber.from(10).pow(16).mul(95);
    await magicBeans.connect(buyer).plantBeans({ value: amount });
    const beans = await magicBeans.Beans(buyer.address);
    console.log("buyer has " + beans + " beans planted");
    expect(beans).to.equal(expectedBalance);
  });

  it("buyer should has 9.5 beans for sale", async function () {
    const amount = new ethers.BigNumber.from(10).pow(16).mul(100);
    const expectedBalance = new ethers.BigNumber.from(10).pow(16).mul(95);
    await magicBeans.connect(buyer).plantBeans({ value: amount });

    await network.provider.send("evm_increaseTime", [200]);
    await network.provider.send("evm_mine");
    const beansForSale = await magicBeans.connect(buyer).howManyBeansGrown(buyer.address);
    console.log("buyer has " + beansForSale + " beans for sale");
    expect(beansForSale).to.equal(expectedBalance);
  });

  it("buyer should has 19 beans planted", async function () {
    const amount = new ethers.BigNumber.from(10).pow(16).mul(100);
    const expectedBalance = new ethers.BigNumber.from(10).pow(16).mul(190);
    await magicBeans.connect(buyer).plantBeans({ value: amount });
    await network.provider.send("evm_increaseTime", [200]);
    await magicBeans.connect(buyer).rePlantBeans();
    const beans = await magicBeans.Beans(buyer.address);
    console.log("buyer has " + beans + " beans planted");
    expect(beans).to.equal(expectedBalance);
  });

  it("buyer should has 19 beans after replanting", async function () {
    const amount = new ethers.BigNumber.from(10).pow(16).mul(100);
    const expectedBalance = new ethers.BigNumber.from(10).pow(16).mul(190);
    await magicBeans.connect(buyer).plantBeans({ value: amount });
    await network.provider.send("evm_increaseTime", [200]);
    await magicBeans.connect(buyer).rePlantBeans();
    const beans = await magicBeans.Beans(buyer.address);
    console.log("buyer has " + beans + " beans planted");
    expect(beans).to.equal(expectedBalance);
  });

  it("buyer should make good money", async function () {
    const amount = new ethers.BigNumber.from(10).pow(16).mul(100);
    await magicBeans.connect(buyer).plantBeans({ value: amount });
    const buyerBalanceBefore = await provider.getBalance(buyer.address);
    await network.provider.send("evm_increaseTime", [100]);
    await network.provider.send("evm_mine");
    await magicBeans.connect(buyer).sellHarvest();
    const buyerBalanceAfter = await provider.getBalance(buyer.address);
    const balanceDif = buyerBalanceAfter - buyerBalanceBefore;
    expect(balanceDif).greaterThan(0);
  });

  it("buyer didn't have Beans for sale", async function () {
    await expect(
      magicBeans.connect(buyer).sellHarvest()
    ).to.be.revertedWith("You have not Beans for sale!");
  });

  it("buyer didn't have money for sale", async function () {
    const amount = new ethers.BigNumber.from(10).pow(16).mul(100);
    await magicBeans.connect(buyer).plantBeans({ value: amount });
    await network.provider.send("evm_increaseTime", [100]);
    await network.provider.send("evm_mine");
    await magicBeans.connect(buyer).sellHarvest();
    await network.provider.send("evm_increaseTime", [100]);
    await network.provider.send("evm_mine");
    await expect(
      magicBeans.connect(buyer).sellHarvest()
    ).to.be.revertedWith("Money ran out!");
  });

  it("buyer should has 9.5 beans planted", async function () {
    const amount = new ethers.BigNumber.from(10).pow(16).mul(100);
    const expectedBalance = new ethers.BigNumber.from(10).pow(16).mul(95);
    await buyer.sendTransaction({
      to: magicBeans.address,
      value: amount,
    });
    const beans = await magicBeans.Beans(buyer.address);
    console.log("buyer has " + beans + " beans planted");
    expect(beans).to.equal(expectedBalance);
  });
});