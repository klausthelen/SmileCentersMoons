const { aggregate, filter } = require('../db/mongo.db.js');


const COLLECTION_NAME = "SmileCenters";

async function getServices() {
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
    return await aggregate(COLLECTION_NAME, agg);

  } catch (err) {
    console.error(err);
  }
}


async function filterDocumentByService(productId) {
    try {
        var matchParam = 'Services.'.concat(productId).concat('.productId');
        return await filter(COLLECTION_NAME, 
            {
            [matchParam]: productId,
            'Center_Type': 'Centro Aliado', 
            'Zone': 'Pereira'
        });
    } catch (err) {
        console.error(err);
      }
}

//TODO: Create repository that will make the filters, and the responses

module.exports = { getServices, filterDocumentByService };