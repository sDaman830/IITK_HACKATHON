// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract DIDContract {
    string hashKey = "oosc";
    
    mapping (string => string) public DiDToCidMapping;
    mapping (string => string) public DiDToKey;
    mapping (string => string) public DiDToUrlMapping;

    // Events
    event UserAdded(string indexed did, string key);
    event SignInAttempt(string indexed did, bool success);

    // Function to add a user
    function addUser(string memory _did, string memory _link, string memory _key) public {
        DiDToKey[_did] = _key;
        // Emit an event when a user is added
        emit UserAdded(_did, _key);
    }

    // Function to sign in a user
    function signIn(string memory _did, string memory _key) external  {
        bool success = (keccak256(abi.encodePacked(DiDToKey[_did])) == keccak256(abi.encodePacked(_key)));
        // Emit an event with the result of the sign-in attempt
        emit SignInAttempt(_did, success);
        require(success, "Keys do not match");
    }
}
