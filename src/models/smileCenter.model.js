const { aggregateCollection, filterCollection } = require('../db/mongo.db.js');


const COLLECTION_NAME = "SmileCenters";

class SmileCenter { 

      static async getServices() {
      try {
        const agg = [
            {
              '$project': {
                'servicesKeys': {
                  '$objectToArray': '$Services'
                }
              }
            }, {
              '$unwind': '$servicesKeys'
            }, {
              '$group': {
                '_id': null, 
                'distinctServices': {
                  '$addToSet': '$servicesKeys.k'
                }
              }
            }, {
              '$project': {
                '_id': 0, 
                'distinctServices': 1
              }
            }
          ];
        return await aggregateCollection(COLLECTION_NAME, agg);

      } catch (err) {
        console.error(err);
      }
    }

    static async getZonesAndCenterTypes() {
      try {
        const agg = [
          {
            '$group': {
              '_id': null, 
              'zones': {
                '$addToSet': '$Zone'
              }, 
              'centerTypes': {
                '$addToSet': '$Center_Type'
              }
            }
          }, {
            '$project': {
              '_id': 0, 
              'zones': 1, 
              'centerTypes': 1
            }
          }
        ];
        return await aggregateCollection(COLLECTION_NAME, agg);

      } catch (err) {
        console.error(err);
      }
    }


    static async filterSmileCenter(filter) {
        try {
            return await filterCollection(COLLECTION_NAME, filter);
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = SmileCenter;