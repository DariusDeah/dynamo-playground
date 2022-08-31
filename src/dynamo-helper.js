import {
  queryTimeLogger,
  startQueryTimeLogger,
} from "./helpers/query-logger.js";
import {
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
  ListTablesCommand,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { ErrorLogger } from "./utils/Errors.js";

class DynamoHelper {
  /**
   * @private
   */
  _client;

  /**
   * @Enum data types that are valid to dynamo db
   */
  dataTypes = {
    /**
     * represents "S" string type in dynamodb attribute/data types
     */
    string: "S",
    /**
     * represents "N" number type in dynamodb attribute/data types
     */
    number: "N",
    /**
     * represents "B" binary type in dynamodb attribute/data types
     */
    binary: "B",
    /**
     * represents "SS" stringset type in dynamodb attribute/data types
     */
    stringset: "SS",
  };
  /**
   * @Enum
   */
  streamViewTypes = {
    /**
     * Only the key attributes of the modified item are written to the stream.
     */
    KEYS_ONLY: "KEYS_ONLY",
    /**
     * The entire item, as it appears after it was modified, is written to the stream.
     */
    NEW_IMAGE: "NEW_IMAGE",
    /**
     * The entire item, as it appeared before it was modified, is written to the stream.
     */
    OLD_IMAGE: "OLD_IMAGE",
    /**
     * Both the new and the old item images of the item are written to the stream.
     */
    NEW_AND_OLD_IMAGES: "NEW_AND_OLD_IMAGES",
  };

  constructor() {
    this._client = new DynamoDBClient({
      endpoint: "http://localhost:8000",
      region: "gfd",
      accessKeyId: "blahh",
      secretAccessKey: "blahh",
    });
  }

  /**
   *
   * @param {string} tableName represents what the name of the table should be called
   * @param {Object[]} data
   * @param {string} data[].fieldName represents AttributeName property in dynamodb
   * @param {string} data[].dataType represents AttributeType property in dynamodb
   * @param {boolean} data[].isPrimaryKey represent dynamodb partition key -> https://aws.amazon.com/blogs/database/choosing-the-right-dynamodb-partition-key/

   */
  async createTable(
    tableName,
    data = [{ fieldName, dataType, isPrimaryKey: false, isSortKey: false }],
    config = {
      enableStream: false,
      StreamViewType,
    }
  ) {
    const attributeDefinitions = data.map((item) => ({
      AttributeName: item.fieldName,
      AttributeType: item.dataType,
    }));

    const keys = {
      primaryKey: data.find((item) => item.isPrimaryKey),
      sortKey: data.find((item) => item.isSortKey),
    };

    const KeySchema = [];
    if (keys.primaryKey) {
      KeySchema.push({
        AttributeName: keys.primaryKey.fieldName,
        KeyType: "HASH",
      });
    }
    if (keys.sortKey) {
      KeySchema.push({
        AttributeName: keys.sortKey.fieldName,
        KeyType: "RANGE",
      });
    }

    const params = {
      TableName: tableName,
      AttributeDefinitions: attributeDefinitions,
      KeySchema,
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      StreamSpecification: {
        StreamEnabled: config.enableStream,
        StreamViewType: config.StreamViewType,
      },
    };

    try {
      startQueryTimeLogger(this.createTable.name);
      const data = await this._client.send(new CreateTableCommand(params));
      queryTimeLogger(this.createTable.name);

      console.log("Table Created💫".green.bold);
      console.table(data.TableDescription.KeySchema);

      return data;
    } catch (error) {
      new ErrorLogger(error);
    }
  }

  async deleteTable(tableName) {
    try {
      startQueryTimeLogger(this.deleteItem.name);
      const data = await this._client.send(
        new DeleteTableCommand({
          TableName: tableName,
        })
      );
      console.log(`table [${tableName}] deleted ❎`);
      queryTimeLogger(this.deleteItem.name);
      return data;
    } catch (error) {
      new ErrorLogger(error);
    }
  }

  async putItem(tableName, items = [{ fieldName, value, dataType }]) {
    const myItems = {};
    items.forEach((item) =>
      Object.defineProperty(myItems, item.fieldName, {
        value: {
          [item.dataType]: item.value,
        },
        writable: false,
        enumerable: true,
      })
    );

    try {
      const params = {
        TableName: tableName,
        Item: myItems,
      };

      startQueryTimeLogger(this.putItem.name);
      const data = await this._client.send(new PutItemCommand(params));
      queryTimeLogger(this.putItem.name);
      console.log(`data inserted into ${tableName} ✅`.bold);
      await this.scanTable(tableName);

      return data;
    } catch (error) {
      new ErrorLogger(error);
    }
  }

  async deleteItem() {
    try {
      startQueryTimeLogger();
      queryTimeLogger("operation: Create-Table");
    } catch (error) {}
  }

  /**
   *
   * @param {import("@aws-sdk/client-dynamodb").UpdateItemCommandInput} data
   */
  async updateItem(data = {}) {
    try {
      startQueryTimeLogger(this.updateItem.name);
      await this._client.send(new UpdateItemCommand(...data));
      queryTimeLogger(this.updateItem.name);
    } catch (error) {}
  }

  /**
   *
   * @param {number} limit
   */
  async listTables(limit = 10) {
    try {
      startQueryTimeLogger(this.listTables.name);
      const data = await this._client.send(
        new ListTablesCommand({
          Limit: limit,
        })
      );
      queryTimeLogger(this.listTables.name);

      if (!data.TableNames.length) {
        console.log("No Tables Found!🤷".red.bold);
        return;
      }
      console.table(data.TableNames);

      return data;
    } catch (error) {
      new ErrorLogger(error);
    }
  }

  async scanTable(tableName) {
    try {
      console.log("scanning table for changes ✨..".bold);
      const data = await this._client.send(
        new ScanCommand({
          TableName: tableName,
        })
      );
      console.log(
        `found ${data.Count} item${
          data.Count > 1 ? "s" : ""
        } in [${tableName}] table`
      );
      console.table(data.Items);

      return data;
    } catch (error) {
      new ErrorLogger(error);
    }
  }
}
export const dynamoHelper = new DynamoHelper();
