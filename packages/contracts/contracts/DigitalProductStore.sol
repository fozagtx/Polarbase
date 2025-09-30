// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DigitalProductStore {
    Product[] public products;
    mapping(address => mapping(uint => bool)) public hasPurchased;
    mapping(uint => uint) public productSales;

    struct Product {
        string name;
        string link;
        uint256 price;
        address payable seller;
        bool isActive;
    }

    event ProductAdded(
        uint indexed productId,
        string name,
        uint256 price,
        address indexed seller
    );

    event ProductPurchased(
        address indexed buyer,
        uint indexed productId,
        address indexed seller,
        uint256 price
    );

    function addProduct(
        string memory name,
        string memory link,
        uint256 price,
        address payable seller
    ) public {
        require(price > 0, "Price must be greater than zero");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(link).length > 0, "Link cannot be empty");
        require(seller != address(0), "Invalid seller address");

        products.push(
            Product({
                name: name,
                link: link,
                price: price,
                seller: seller,
                isActive: true
            })
        );

        emit ProductAdded(products.length - 1, name, price, seller);
    }

    function purchaseProduct(uint productId) public payable {
        require(productId < products.length, "Product does not exist");
        Product storage product = products[productId];
        require(product.isActive, "Product is not available");
        require(msg.value == product.price, "Incorrect payment amount");
        require(
            !hasPurchased[msg.sender][productId],
            "Product already purchased"
        );

        hasPurchased[msg.sender][productId] = true;
        productSales[productId] += 1;

        // Transfer payment directly to seller
        (bool success, ) = product.seller.call{value: msg.value}("");
        require(success, "Payment to seller failed");

        emit ProductPurchased(msg.sender, productId, product.seller, msg.value);
    }

    function getProduct(
        uint productId
    )
        public
        view
        returns (
            string memory name,
            string memory link,
            uint256 price,
            address seller,
            bool isActive
        )
    {
        require(productId < products.length, "Product does not exist");
        Product memory product = products[productId];

        string memory productLink = hasPurchased[msg.sender][productId]
            ? product.link
            : "";

        return (
            product.name,
            productLink,
            product.price,
            product.seller,
            product.isActive
        );
    }

    function getProductLength() public view returns (uint) {
        return products.length;
    }

    function deactivateProduct(uint productId) public {
        require(productId < products.length, "Product does not exist");
        require(
            msg.sender == products[productId].seller,
            "Only seller can deactivate"
        );
        products[productId].isActive = false;
    }

    function hasUserPurchased(
        address user,
        uint productId
    ) public view returns (bool) {
        require(productId < products.length, "Product does not exist");
        return hasPurchased[user][productId];
    }
}
