const { getContractFactory } = require("@nomiclabs/hardhat-ethers/types");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

describe("CryptoToken", function() {
  
  it("checking if the total supply is correct and checking if the balance of an address is correct", async function() {
    const [owner] = await ethers.getSigners()

    const CriptoToken = await ethers.getContractFactory("CriptoToken")
    const token = await CriptoToken.deploy(1000000000000)
    await token.deployed()

    const expectedValue = 1000000000000

    expect(await token.totalSupply()).to.equal(expectedValue)
    expect(await token.balanceOf(owner.address)).to.equal(expectedValue)
  })

  it("checking if the total supply is incorrect and checking if the balance of an address is incorrect", async function() {
    const [owner] = await ethers.getSigners()

    const CriptoToken = await ethers.getContractFactory("CriptoToken")
    const token = await CriptoToken.deploy(1000000000000)
    await token.deployed()
    
    const expectedValue = 1000

    expect(await token.totalSupply() == expectedValue).to.equal(false)
    expect(await token.balanceOf(owner.address) == expectedValue).to.equal(false)
  })

  it("checking the transfer, if you are subtracting the value of the sent and adding the receiver", async function() {
    const [owner, receiver] = await ethers.getSigners()
    
    const Token = await ethers.getContractFactory("CriptoToken");
    const token = await Token.deploy(10000);
    await token.deployed()

    const currentBalanceOwner = await token.balanceOf(owner.address)
    const currentBalanceReceiver = await token.balanceOf(receiver.address)

    const amountSent = 1000

    const transferTx = await token.transfer(receiver.address, amountSent)
    await transferTx.wait()

    const modifiedBalanceOwner = await token.balanceOf(owner.address)
    const modifiedBalanceReceiver = await token.balanceOf(receiver.address)

    expect(parseInt(modifiedBalanceOwner) + amountSent).to.equal(currentBalanceOwner)
    expect(parseInt(modifiedBalanceReceiver) - amountSent).to.equal(currentBalanceReceiver)
  })

  it("checking multiple outgoing balance transfers", async function() {
    const [owner, receiver1, receiver2, receiver3] = await ethers.getSigners()

    const Token = await ethers.getContractFactory("CriptoToken")
    const token = await Token.deploy(10000)
    await token.deployed()

    const currentBalanceOwner = await token.balanceOf(owner.address)

    const amountSent1 = 1000
    const transferTx1 = await token.transfer(receiver1.address, amountSent1)
    await transferTx1.wait()

    const amountSent2 = 500
    const transferTx2 = await token.transfer(receiver2.address, amountSent2)
    await transferTx2.wait()

    const amountSent3 = 1500
    const transferTx3 = await token.transfer(receiver3.address, amountSent3)
    await transferTx3.wait()

    const modifiedBalanceOwner = await token.balanceOf(owner.address)

    expect(parseInt(modifiedBalanceOwner) + (amountSent1 + amountSent2 + amountSent3)).to.equal(currentBalanceOwner)
  })

  it("checking multiple balance gain transfers", async function() {
    const [owner, sender1, sender2, sender3] = await ethers.getSigners()

    const Token = await ethers.getContractFactory("CriptoToken")
    const token = await Token.deploy(9000)
    await token.deployed()

    const amountSent = 3000
    
    const transferOwner1 = await token.transfer(sender1.address, amountSent)
    await transferOwner1.wait()

    const transferOwner2 = await token.transfer(sender2.address, amountSent)
    await transferOwner2.wait()

    const transferOwner3 = await token.transfer(sender3.address, amountSent)
    await transferOwner3.wait()

    const currentBalanceOwner = await token.balanceOf(owner.address)
    
    const transferTx1 = await token.connect(sender1).transfer(owner.address, amountSent)
    await transferTx1.wait()
    
    const transferTx2 = await token.connect(sender2).transfer(owner.address, amountSent)
    await transferTx2.wait()
    
    const transferTx3 = await token.connect(sender3).transfer(owner.address, amountSent)
    await transferTx3.wait()
    
    const modifiedBalanceOwner = await token.balanceOf(owner.address)

    expect(parseInt(modifiedBalanceOwner) - (amountSent * 3)).to.equal(currentBalanceOwner)
  })
})
