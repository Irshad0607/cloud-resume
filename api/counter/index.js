const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    
    // Connect to Cosmos DB using the connection string
    const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
    
    const database = client.database("ResumeDB");
    const container = database.container("Counter");

    // Read the current counter document
    const { resource: item } = await container.item("1", "1").read();
    
    // Add 1 to the count
    item.count += 1;
    
    // Save the updated count back to Cosmos DB
    await container.item("1", "1").replace(item);

    // Send the count back as a response
    context.res = {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ count: item.count })
    };
};