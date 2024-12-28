const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  try {
    const { httpMethod } = event;
    const id = event.pathParameters?.proxy?.split('/')[1] || event.pathParameters?.id;

    switch(httpMethod) {
      case 'GET':
        if (id) {
          const getCommand = new GetCommand({
            TableName: TABLE_NAME,
            Key: { id }
          });
          const item = await dynamodb.send(getCommand);
          return response(200, item.Item || null);
        }
        
        const scanCommand = new ScanCommand({
          TableName: TABLE_NAME
        });
        const items = await dynamodb.send(scanCommand);
        return response(200, items.Items || []);

      case 'POST':
        const newItem = JSON.parse(event.body);
        const putCommand = new PutCommand({
          TableName: TABLE_NAME,
          Item: newItem
        });
        await dynamodb.send(putCommand);
        return response(201, newItem);

      case 'PUT':
        const updateItem = JSON.parse(event.body);
        const updateCommand = new PutCommand({
          TableName: TABLE_NAME,
          Item: updateItem
        });
        await dynamodb.send(updateCommand);
        return response(200, updateItem);

      case 'DELETE':
        if (!id) {
          return response(400, { message: 'Missing id parameter' });
        }

        // Check if item exists before deleting
        const getItemCommand = new GetCommand({
          TableName: TABLE_NAME,
          Key: { id }
        });
        
        const existingItem = await dynamodb.send(getItemCommand);
        if (!existingItem.Item) {
          return response(404, { message: 'Item not found' });
        }

        const deleteCommand = new DeleteCommand({
          TableName: TABLE_NAME,
          Key: { id }
        });
        await dynamodb.send(deleteCommand);
        return response(200, { message: 'Item deleted successfully' });

      case 'OPTIONS':
        return response(200, null);

      default:
        return response(405, { message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    return response(500, { 
      message: 'Internal server error',
      error: error.message // Adding error message for debugging
    });
  }
};

const response = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
  },
  body: body ? JSON.stringify(body) : ''
});
