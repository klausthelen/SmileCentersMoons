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
        let productId = null;
        if(query.product_id) {
            productId = query.product_id;
            const serviceParam = 'Services.'.concat(productId).concat('.productId');
            filter[serviceParam] = productId;
        }

        query.center_type && (filter.Center_Type = query.center_type);
        query.zone && (filter.Zone = query.zone);

        const results = await SmileCenters.filterDocumentByService(filter);
        return this.buildResponse(results, productId);
    }

    static buildResponse(results, productId) {
        const response = [];
        results.forEach(result => {
            response.push(
                {
                    centerName: result.Center_Name,
                    address: result.Street ? result.Street.concat(result.Number): null,
                    calendarId: result.Calendar_Id,
                    promo: result.promo,
                    centerIcon: result.Center_Icon,
                    schedule: result.Timetable,
                    city: result.City,
                    country: result.Country,
                    appointmentTypeId: productId ? result.Services[productId].AppointmentTypeId 
                                        : result.Appointment_Type_Id ? result.Appointment_Type_Id 
                                        : null
                }
            );
        });
        return response;
    }
}

module.exports = SmileCenterRepository;