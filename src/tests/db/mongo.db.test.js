const { aggregateCollection, filterCollection } = require('../../db/mongo.db');

const mockAggregate = jest.fn();
const mockFind = jest.fn();
const mockToArray = jest.fn();
const mockCollection = jest.fn(() => ({ aggregate: mockAggregate, find: mockFind }));
const mockDb = { collection: mockCollection };

jest.mock('mongodb', () => {
  const originalModule = jest.requireActual('mongodb');
  const mockConnect = jest.fn().mockResolvedValue();
  return {
    ...originalModule,
    MongoClient: jest.fn(() => ({ 
        connect: mockConnect, 
        db: jest.fn(() => mockDb) ,
        close: jest.fn()
    })),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

test('should aggregate collection', async () => {
  mockAggregate.mockReturnValueOnce({ toArray: mockToArray });
  mockToArray.mockResolvedValueOnce(['resultado1', 'resultado2']);

  const resultado = await aggregateCollection('miColeccion', {});

  expect(mockCollection).toHaveBeenCalledWith('miColeccion');
  expect(mockAggregate).toHaveBeenCalledWith({});
  expect(mockToArray).toHaveBeenCalled();
  expect(resultado).toEqual(['resultado1', 'resultado2']);
});

test('should filter collection', async () => {
  mockFind.mockReturnValueOnce({ toArray: mockToArray });
  mockToArray.mockResolvedValueOnce(['resultado1', 'resultado2']);

  const resultado = await filterCollection('miColeccion', {});

  expect(mockCollection).toHaveBeenCalledWith('miColeccion');
  expect(mockFind).toHaveBeenCalledWith({});
  expect(mockToArray).toHaveBeenCalled();
  expect(resultado).toEqual(['resultado1', 'resultado2']);
});