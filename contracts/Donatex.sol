pragma solidity ^0.4.15;

import "./base/SafeMath.sol";

contract Donatex {

    struct Donation {
        address owner;
        uint donation;
        bytes32 name;
        bytes text;
    }

    struct DonationBox {
        address owner;
        uint numDonations;
        uint totalDonations;
        bool isValue;
    }

    mapping (bytes32 => Donation[]) public donations;
    mapping (bytes32 => DonationBox) public donationBoxes;

    /**
    * @dev Throws if called by any address other than the one that owns the ID
    */
    modifier onlyOwner(bytes32 id) {
        require(msg.sender == donationBoxes[id].owner);
        _;
    }

    function Donatex() {
        
    }

    function claimId(bytes32 id) public {
        require(!donationBoxes[id].isValue);
        donationBoxes[id] = DonationBox(msg.sender, 0, 0, true);
    }

    function donate(bytes32 id, bytes32 name, bytes text) payable public {
        require(donationBoxes[id].isValue);
        DonationBox storage donationBox = donationBoxes[id];
        donations[id].push(Donation(msg.sender, msg.value, name, text));
        donationBox.totalDonations = SafeMath.add(donationBox.totalDonations, msg.value);
        donationBox.numDonations = SafeMath.add(donationBox.numDonations, 1);
    }

    function transferDonations(bytes32 id, address destination) onlyOwner(id) {
        require(donationBoxes[id].isValue);
        DonationBox storage donationBox = donationBoxes[id];
        require(donationBox.totalDonations > 0);
        require(destination.send(donationBox.totalDonations));
    }
    
}