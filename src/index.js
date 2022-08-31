import { dynamoHelper } from "./dynamo-helper.js";

/*
const randomId = Math.floor(Math.random() * 1000).toString();
dynamoHelper.createTable("testing2", [
  {
    fieldName: "auth0_id",
    dataType: dynamoHelper.dataTypes.string,
    isPrimaryKey: true,
  },
  {
    fieldName: "full_name",
    dataType: dynamoHelper.dataTypes.string,
    isSortKey: true,
  },
]);

const data = await dynamoHelper.putItem("testing2", [
  {
    fieldName: "auth0_id",
    dataType: dynamoHelper.dataTypes.string,
    value: randomId,
  },
  {
    fieldName: "full_name",
    dataType: dynamoHelper.dataTypes.string,
    value: "Jojo Cole",
  },
  {
    fieldName: "age",
    dataType: dynamoHelper.dataTypes.number,
    value: randomId,
  },
  {
    fieldName: "friends",
    dataType: dynamoHelper.dataTypes.stringset,
    value: ["Mark", "John", "Cole"],
  },
]);
*/
// dynamoHelper.deleteTable("volunteer");

dynamoHelper.listTables(10);
dynamoHelper.createTable(
  "volunteer",
  [
    {
      fieldName: "user_id",
      dataType: dynamoHelper.dataTypes.string,
      isPrimaryKey: true,
    },
  ],
  {
    enableStream: true,
    StreamViewType: dynamoHelper.streamViewTypes.NEW_AND_OLD_IMAGES,
  }
);

dynamoHelper.putItem("volunteer", [
  {
    fieldName: "user_id",
    dataType: dynamoHelper.dataTypes.string,
    value: "auth0|112",
  },
  {
    fieldName: "name",
    dataType: dynamoHelper.dataTypes.string,
    value: "Bob Dylan",
  },
  {
    fieldName: "skills",
    dataType: dynamoHelper.dataTypes.stringset,
    value: ["comp sci", "education", "physics"],
  },
  {
    fieldName: "projects",
    dataType: dynamoHelper.dataTypes.stringset,
    value: ["1234", "2345", "34234"],
  },
  {
    fieldName: "role",
    dataType: dynamoHelper.dataTypes.string,
    value: "admin",
  },
  {
    fieldName: "profile_views",
    dataType: dynamoHelper.dataTypes.number,
    value: 2000,
  },
  {
    fieldName: "timezone",
    dataType: dynamoHelper.dataTypes.string,
    value: "America/Boise",
  },
  {
    fieldName: "age",
    dataType: dynamoHelper.dataTypes.number,
    value: 40,
  },
  {
    fieldName: "Profession",
    dataType: dynamoHelper.dataTypes.string,
    value: "Project Manager",
  },
]);
// dynamoHelper.updateItem({
//   Key:
// });
