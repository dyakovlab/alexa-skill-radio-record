const AWS = require('aws-sdk');
AWS.config.update({region: process.env.DYNAMODB_PERSISTENCE_REGION});
const dynamoDB = new AWS.DynamoDB.DocumentClient();


class Translator {
  static async translate (code) {
    const result = {
      title: null,
      subtitle: null
    }
    try {
      const translation = await this.getTranslationFromDynamoDB(code);
      if (translation && translation.title && translation.subtitle) {
        result.title = translation.title;
        result.subtitle = translation.subtitle;
      }
      return result
    } catch (e) {
      return result
    }
  }

  static getTranslationFromDynamoDB(code) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: process.env.DYNAMODB_PERSISTENCE_TABLE_NAME,
        Key: {
          "id": code
        }
      };

      dynamoDB.get(params, function(err, data) {
        if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
          reject(err);
        } else {
          if (data.Item) {
            resolve(data.Item);
          } else {
            resolve(null);
          }
        }
      });
    });
  }
}

module.exports = Translator;