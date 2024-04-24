const SmileCenterRepository = require("../../repositories/smileCenter.repository");
const SmileCenters = require('../../models/smileCenter.model');

jest.mock('../../models/smileCenter.model', () => ({
    getServices: jest.fn(),
    getZonesAndCenterTypes: jest.fn(),
    filterSmileCenter : jest.fn()
}));

const mockSimpleResult = [
  {
      "_id": "8FMFyWvZDh",
      "Timetable": {
        "saturday": [
          "10:00-18:00"
        ],
        "weekdays": [
          "10:00-18:00"
        ]
      },
      "Appointment_Type_Id" : 5465487,
      "Street": "Lafontaine",
      "Center_Icon": "https://prod-moons-website.s3.amazonaws.com/icono_diente_estrella.svg",
      "Center_Type": "Centro Moons",
      "Apt": "Piso 4, consultorio 2-3",
      "Number": "97",
      "City": "Miguel Hidalgo",
      "Zone": "Polanco",
      "State": "Ciudad de México",
      "Center_Name": "Polanco Full",
      "Calendar_Id": 8713409,
      "promo": "20% de Descuento",
      "Country": "México",
      "Center_Type": "Liverpool",
      "Center_Desc": "Timbre a un costado de Wax Revolution. Piso 4",
      "Services": {
        "fullprimera": {
          "productId": "fullprimera",
          "AppointmentTypeId": "53474599"
        },
        "fullseguimiento": {
          "productId": "fullseguimiento",
          "AppointmentTypeId": "53222904"
        }
      }
    }      
];


beforeEach(() => {
  jest.clearAllMocks();
});

test('should get attributes to filter', async () => {
  const mockServicesArray = [{ distinctServices: ['fullprimera', 'fullseguimiento'] }];
  const mockOtherFilters = [{  zones: ['Pereira', 'Bogota'], centerTypes: ['Liverpool', 'Centro Aliado'] }];
  SmileCenters.getServices.mockResolvedValueOnce(mockServicesArray);
  SmileCenters.getZonesAndCenterTypes.mockResolvedValueOnce(mockOtherFilters);

  const resultado = await SmileCenterRepository.getAttributesToFilter();

  expect(SmileCenters.getServices).toHaveBeenCalled();
  expect(SmileCenters.getZonesAndCenterTypes).toHaveBeenCalled();
  expect(resultado).toEqual({
    services: mockServicesArray[0].distinctServices,
    zones: mockOtherFilters[0].zones,
    center_types: mockOtherFilters[0].centerTypes
  });
});


test('should filter document inclusive', async () => {
    const mockResult = [
        {
            "_id": "8FMFyWvZDh",
            "Timetable": {
              "saturday": [
                "10:00-18:00"
              ],
              "weekdays": [
                "10:00-18:00"
              ]
            },
            "Moons_Center": true,
            "Street": "Lafontaine",
            "Number": "73",
            "City": "Miguel Hidalgo",
            "Zone": "Polanco",
            "Center_Name": "Polanco Full",
            "Center_Icon": "https://prod-moons-website.s3.amazonaws.com/icono_diente_estrella.svg",
            "Calendar_Id": 8713409,
            "promo": "20% de Descuento",
            "Country": "México",
            "Center_Type": "Liverpool",
            "Services": {
              "fullprimera": {
                "productId": "fullprimera",
                "AppointmentTypeId": "53474599"
              },
              "fullseguimiento": {
                "productId": "fullseguimiento",
                "AppointmentTypeId": "53222904"
              }
            }
          }      
    ];

    const mockQuery = { 
        product_id: ['fullprimera', 'fullseguimiento'], 
        center_type: ['Liverpool', 'Centro Aliado'], 
        zone: ['Pereira', 'Polanco'], 
        inclusive: true 
    };

    SmileCenters.filterSmileCenter.mockResolvedValueOnce(mockResult);
  
    const resultado = await SmileCenterRepository.filterDocument(mockQuery);
  
    expect(SmileCenters.filterSmileCenter).toHaveBeenCalledWith(
        {
            '$or': [
              { 'Services.fullprimera.productId': 'fullprimera' },
              { 'Services.fullseguimiento.productId': 'fullseguimiento' },
              { Center_Type: 'Liverpool' },
              { Center_Type: 'Centro Aliado' },
              { Zone: 'Pereira' },
              { Zone: 'Polanco' }
            ]
        }
    );
    expect(resultado).toEqual([
        {
            "centerName": "Polanco Full",
            "address": "Lafontaine 73",
            "calendarId": 8713409,
            "centerIcon": "https://prod-moons-website.s3.amazonaws.com/icono_diente_estrella.svg",
            "schedule": {
              "saturday": [
                "10:00-18:00"
              ],
              "weekdays": [
                "10:00-18:00"
              ]
            },
            "city": "Miguel Hidalgo",
            "country": "México",
            "promo": "20% de Descuento",
            "appointmentTypeIdList": [
                "53474599",
                "53222904"
            ]
          }
    ]); 
  });


  test('should filter document NOT inclusive', async () => {

    const mockQuery = { 
        zone: ['Polanco']
    };

    SmileCenters.filterSmileCenter.mockResolvedValueOnce(mockSimpleResult);
  
    const resultado = await SmileCenterRepository.filterDocument(mockQuery);
  
    expect(SmileCenters.filterSmileCenter).toHaveBeenCalledWith(
        {
            '$and': [
                { Zone: 'Polanco' }
            ]
        }
    );
    expect(resultado).toEqual([
        {
            "centerName": "Polanco Full",
            "address": "Lafontaine 97",
            "calendarId": 8713409,
            "centerIcon": "https://prod-moons-website.s3.amazonaws.com/icono_diente_estrella.svg",
            "schedule": {
              "saturday": [
                "10:00-18:00"
              ],
              "weekdays": [
                "10:00-18:00"
              ]
            },
            "city": "Miguel Hidalgo",
            "country": "México",
            "promo": "20% de Descuento",
            "appointmentTypeIdList": [
                "5465487"
            ]
        }
    ]); 
  });


  test('should filter document if query is a string', async () => {

    const mockQuery = { 
        zone: 'Polanco',
        product_id: 'fullseguimiento',
        center_type: 'Liverpool'
    };

    SmileCenters.filterSmileCenter.mockResolvedValueOnce(mockSimpleResult);
  
    await SmileCenterRepository.filterDocument(mockQuery);
  
    expect(SmileCenters.filterSmileCenter).toHaveBeenCalledWith(
        {
            '$and': [
                { 'Services.fullseguimiento.productId': 'fullseguimiento' },
                { Center_Type: 'Liverpool' },
                { Zone: 'Polanco' }
            ]
        }
    );
  });