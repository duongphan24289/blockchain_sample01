const SimpleContract = artifacts.require("SimpleContract");
const truffleAssert = require('truffle-assertions');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
// contract("SimpleContract", function (accounts) {
//   it("should assert true", async function () {
//     await SimpleContract.deployed();
//     return assert.isTrue(true);
//   });
// });


contract("SimpleContract", (accounts) => {
  // let instance ;

  it("should return the list of accounts", async () => {
    console.log(accounts);
  });

  it("should return the name", async() => {
    const instance = await SimpleContract.deployed();
    const value = await instance.getName();

    assert.equal(value, 'my name');
  });

  it("should return change the name", async() => {
    const instance = await SimpleContract.deployed();
    await instance.changeName('pvd');

    const value = await instance.getName();

    assert(value, 'pvd');
  });

  it("should execute only by the owner", async() => {
    const instance = await SimpleContract.deployed();

    await instance.changeName('modifier', {
      from: accounts[0]
    });
    const value = await instance.getName();
    assert.equal(value, 'modifier');
  });

  it("should fail", async() => {
    const instance = await SimpleContract.deployed();

    await truffleAssert.reverts(instance.changeName('modifier', {
      from: accounts[1]
    }));
  });

  /**
   * Test Event
   */
  it("should check the type of the event", async() => {
    const instance = await SimpleContract.deployed();
    const result = await instance.changeName('hello event');
    truffleAssert.eventEmitted(result, 'NameEvent');

    truffleAssert.eventEmitted(result, "NameEvent", (event) => {
      return event.evPram == "hello event";
    });
  });

  it("should print the event parameters", async() => {
    const instance = await SimpleContract.deployed();
    let result = await instance.changeName("hello event");

    truffleAssert.prettyPrintEmittedEvents(result);
  });

});