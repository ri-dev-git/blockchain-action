// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract BasicNft is ERC721, Ownable {
    string public constant TOKEN_URI =
        "ipfs://bafkreicxa2o7utz6q3hs6uyerl5vmvkba2wzh7arktjfm3y4w2tnbtdzzm.ipfs.localhost:8080/?filename=nft.json";
    uint256 private s_tokenCounter;

    constructor(address initialOwner) ERC721("SimpleNFT", "SMTK") Ownable(initialOwner) {
        s_tokenCounter = 0;
        
    }

    function mintNft() public onlyOwner{
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter = s_tokenCounter + 1;
    }

    function tokenURI(uint256 tokenId) public  returns (string memory) {
        // require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
