
pragma solidity ^0.8.0;

contract DIDRegistry {
    // Mapping to store the relationship between DIDs and CIDs
    mapping(string => string) private didToCid;

    // Event that is emitted when a DID is added
    event DIDAdded(string indexed did, string cid);

    // Function to add a DID and its corresponding CID
    function addDID(string memory did, string memory cid) public {
        require(bytes(didToCid[did]).length == 0, "DID already exists");
        didToCid[did] = cid;

        // Emit the event when a DID is added
        emit DIDAdded(did, cid);
    }

    // Function to resolve a DID and get the corresponding CID
    function resolveDID(string memory did) public view returns (string memory) {
        require(bytes(didToCid[did]).length != 0, "DID not found");
        return didToCid[did];
    }
}
