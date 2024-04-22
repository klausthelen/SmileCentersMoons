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
        if(query.product_id) {
            const matchParam = 'Services.'.concat(query.product_id).concat('.productId');
            query.product_id && (filter[matchParam] = query.product_id);
        }

        query.center_type && (filter.Center_Type = query.center_type);
        query.zone && (filter.Zone = query.zone);

        const result = await SmileCenters.filterDocumentByService(filter);
        return result;
    }
}

module.exports = SmileCenterRepository;