const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");

const searchProduct = tool(async ({ query, token }) => {
    if (!token) {
        throw new Error("Authentication token is required but was not provided");
    }
    
    const response = await axios.get(`http://localhost:4001/api/products?q=${query}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return JSON.stringify(response.data);
}, {
    name: "searchProduct",
    description: "Search for products based on a query",
    schema: z.object({
        query: z.string().describe("The search query for the product"),
        token: z.string().optional().describe("Authentication token"),
    })
});

const addProductToCart = tool(async ({ productId, qty=1, token }) => {
    
    if (!token) {
        throw new Error("Authentication token is required but was not provided");
    }
    
    const response = await axios.post(`http://localhost:4002/api/cart/items`, {
        productId,
        qty
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return `Added product with id ${productId} (qty: ${qty}) to cart.`;
}, {
    name: "addProductToCart",
    description: "Add a product to the shopping cart",
    schema: z.object({
        productId: z.string().describe("The ID of the product to add to the cart"),
        qty: z.number().optional().describe("The quantity of the product to add, default is 1").default(1),
        token: z.string().optional().describe("Authentication token"),
    })
});

module.exports = {
    searchProduct,
    addProductToCart
};
