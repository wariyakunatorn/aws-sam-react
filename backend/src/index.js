const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { 
  DynamoDBDocumentClient, 
  GetCommand, 
  PutCommand, 
  DeleteCommand, 
  ScanCommand 
} = require('@aws-sdk/lib-dynamodb');

// Initialize DynamoDB client once (outside handler for reuse)
const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE_NAME = process.env.TABLE_NAME;

// Helper functions
const response = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify(body)
});

const getItem = async (id) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { id }
  });
  const { Item } = await dynamodb.send(command);
  return Item || null;
};

const getAllItems = async () => {
  const command = new ScanCommand({ TableName: TABLE_NAME });
  const { Items } = await dynamodb.send(command);
  return Items || [];
};

const createItem = async (item) => {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: item
  });
  await dynamodb.send(command);
  return item;
};

const deleteItem = async (id) => {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { id }
  });
  await dynamodb.send(command);
  return { id };
};

const updateItem = async (id, item) => {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: { ...item, id }
  });
  await dynamodb.send(command);
  return item;
};

exports.handler = async (event) => {
  try {
    const { httpMethod, pathParameters } = event;
    const id = pathParameters?.proxy?.split('/')[1] || pathParameters?.id;

    switch(httpMethod) {
      case 'GET':
        return response(200, id ? await getItem(id) : await getAllItems());
      
      case 'POST':
        if (!event.body) return response(400, { message: 'Missing request body' });
        const newItem = JSON.parse(event.body);
        return response(201, await createItem(newItem));
        
      case 'DELETE':
        if (!id) return response(400, { message: 'Missing ID parameter' });
        await deleteItem(id);
        return response(200, { message: 'Item deleted successfully' });

      case 'PUT':
        if (!id) return response(400, { message: 'Missing ID parameter' });
        const item = JSON.parse(event.body);
        await updateItem(id, item);
        return response(200, item);

      default:
        return response(405, { message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    return response(500, { message: 'Internal server error' });
  }
};
