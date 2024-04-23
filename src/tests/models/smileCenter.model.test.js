const { aggregateCollection, filterCollection } = require('../../db/mongo.db');
const SmileCenter = require('../../models/smileCenter.model.js'); 

jest.mock('../../db/mongo.db', () => ({
    aggregateCollection: jest.fn(),
    filterCollection: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test('should get services from SmileCenters', async () => {
  const mockResult = ['fullprimera', 'fullseguimiento'];
  aggregateCollection.mockResolvedValueOnce(mockResult);
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

  const resultado = await SmileCenter.getServices();

  expect(aggregateCollection).toHaveBeenCalledWith('SmileCenters', agg);
  expect(resultado).toEqual(mockResult);
});

test('should get zones and center types from SmileCenters', async () => {
  const mockResult = { zones: ['Pereira', 'Bogota'], centerTypes: ['Liverpool', 'Centro Aliado'] };
  aggregateCollection.mockResolvedValueOnce(mockResult);
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

  const resultado = await SmileCenter.getZonesAndCenterTypes();

  expect(aggregateCollection).toHaveBeenCalledWith('SmileCenters', agg);
  expect(resultado).toEqual(mockResult);
});

test('should filter SmileCenters documents by service', async () => {
  const mockResult = ['result1', 'result2'];
  const mockFilter = { Center_Type: 'Centro Aliado' };
  filterCollection.mockResolvedValueOnce(mockResult);

  const resultado = await SmileCenter.filterSmileCenter(mockFilter);

  expect(filterCollection).toHaveBeenCalledWith('SmileCenters', mockFilter);
  expect(resultado).toEqual(mockResult);
});