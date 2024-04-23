const SmileCenters = require('../models/smileCenter.model');


class SmileCenterRepository { 

    static async getAttributesToFilter() {
        const servicesArray = await SmileCenters.getServices();
        const otherFilters = await SmileCenters.getZonesAndCenterTypes();
        const filtersArray = {
            services : servicesArray[0].distinctServices,
            zones : otherFilters[0].zones,
            center_types : otherFilters[0].centerTypes
        };
        return filtersArray;
    }


    static async filterDocument(query) {
        const filter = {};
        const filterArray = [];
        const productIdList = [];

        if(query.product_id) {
            query.product_id.forEach(
                singleproductId => {
                    const serviceParam = 'Services.'.concat(singleproductId).concat('.productId');
                    filterArray.push({
                        [serviceParam]: singleproductId
                    });
                    productIdList.push(singleproductId);
                }
            );
        }

        if(query.center_type) {
            query.center_type.forEach(
                singleCenterType => {
                    filterArray.push({
                        'Center_Type': singleCenterType
                    });
                }
            );
        }

        if(query.zone) {
            query.zone.forEach(
                singleZone => {
                    filterArray.push({
                        'Zone': singleZone
                    });
                }
            );
        }

        if(filterArray.length > 0) {
            query.inclusive ? filter['$or'] =  filterArray : filter['$and'] =  filterArray;
        }
        const results = await SmileCenters.filterSmileCenter(filter);
        return this.buildResponse(results, productIdList);
    }

    static buildResponse(results, productIdList) {
        const response = [];
        results.forEach(result => {
            response.push(
                {
                    centerName: result.Center_Name,
                    address: result.Street ? result.Street.concat(" ").concat(result.Number): null,
                    calendarId: result.Calendar_Id,
                    promo: result.promo,
                    centerIcon: result.Center_Icon,
                    schedule: result.Timetable,
                    city: result.City,
                    country: result.Country,
                    appointmentTypeIdList: productIdList.length > 0 ? this.buildAppointmentTypeIdList(result.Services, productIdList)
                                        : result.Appointment_Type_Id ? [result.Appointment_Type_Id.toString()]
                                        : []
                }
            );
        });
        return response;
    }
    

    static buildAppointmentTypeIdList(services, productIdList) {
        const appointmentTypeIdList = [];
        Object.entries(services).forEach(([key, value]) => {
            if(productIdList.indexOf(key) >= 0) {
                appointmentTypeIdList.push(value.AppointmentTypeId);
            }
        });
        
        return appointmentTypeIdList;
    }
}

module.exports = SmileCenterRepository;