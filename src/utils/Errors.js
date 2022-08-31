import { DynamoDBServiceException } from "@aws-sdk/client-dynamodb";
export class ErrorLogger extends Error {
  constructor(err) {
    super();
    if (
      new DynamoDBServiceException(err).message.includes("preexisting") ||
      new DynamoDBServiceException(err).message.includes("non-existent")
    ) {
      return;
    }
    console.log("DATABASE ERROR".red.bold);
    console.log({
      blame:
        new DynamoDBServiceException(err).$fault == "client"
          ? "Seems like you made an error somewhere, check your code and try again"
          : "Seems like aws had trouble processing your request, are all configurations set up properly?",
      cause: new DynamoDBServiceException(err)?.message,
      statusCode:
        new DynamoDBServiceException(err).$metadata?.httpStatusCode ??
        "unknown",
      attempts: new DynamoDBServiceException(err).$metadata?.attempts,
    });
  }
}
