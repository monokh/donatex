var Donatex = artifacts.require('./Donatex.sol');
var SHA256 = require("crypto-js/sha256");

function assertVMException(err) {
  if(err.toString().indexOf('Error: VM Exception') === -1) {
    throw err;
  }
}

contract('Donatex', function (accounts) {

  var donatex;

  beforeEach(function(done) {
    Donatex.new().then((instance) => {
      donatex = instance;
      done();
    });
  });

  it('claim and then donation works', function () {
    const id = web3.sha3('https://myurl.com/test-post');
    const name = web3.fromAscii('me', 32);
    const comment = web3.fromAscii('Baller work brudda');
    return donatex.claimId.sendTransaction(id, web3.toWei(0.001, 'ether')).then((tx) => {
      return donatex.donate.sendTransaction(id, name, comment, {value: web3.toWei(1, 'ether')});
    }).then((tx) => {
      return donatex.donations.call(id, 0);
    }).then((result) => {
      assert.strictEqual(result[0], accounts[0]);
      assert.strictEqual(result[1].toString(), web3.toWei(1, 'ether'));
      assert.strictEqual(web3.toAscii(result[2], 32).replace(/\u0000/g, ''), 'me');
      assert.strictEqual(web3.toAscii(result[3]).replace(/\u0000/g, ''), 'Baller work brudda');
      return donatex.donationBoxes.call(id);
    }).then( (donationBox) => {
      assert.strictEqual(donationBox[0], accounts[0]);
      assert.strictEqual(donationBox[1].toString(), web3.toWei(0.001, 'ether'));
      assert.strictEqual(donationBox[2].toString(), '1');
      assert.strictEqual(donationBox[3].toString(), web3.toWei(1, 'ether'));
    })
    .catch((err) => { throw new Error(err) })
  })
  
  it('donation less than minimum fails', function () {
    const id = web3.sha3('https://myurl.com/test-post');
    const name = web3.fromAscii('me', 32);
    const comment = web3.fromAscii('Baller work brudda');
    return donatex.claimId.sendTransaction(id, web3.toWei(0.001, 'ether')).then((tx) => {
      return donatex.donate.sendTransaction(id, name, comment, {value: web3.toWei(0.0005, 'ether')});
    }).then((tx) => {
      assert.fail();
    })
    .catch(assertVMException);
  });

  it('donation without claim wont work', function () {
    const id = web3.sha3('https://myurl.com/test-post');
    const name = web3.fromAscii('me', 32);
    const comment = web3.fromAscii('Baller work brudda');
    return donatex.donate.sendTransaction(id, name, comment, {value: web3.toWei(1, 'ether')})
    .then((tx) => {
      assert.fail();
    })
    .catch(assertVMException);
  })

});