const cds = require('@sap/cds');

module.exports = class LogisticsService extends cds.ApplicationService {
    init() {
        const { Shipments, Packages } = this.entities;
        const rates = { A: 15, S: 5, R: 8 };

        this.after('READ', Shipments, async (data, req) => {
            if (!data) return;
            const shipments = Array.isArray(data) ? data : [data];

            for (const shipment of shipments) {
                let packages = shipment.packages;

                // Handle case where packages were not expanded
                if (!packages) {
                    packages = await SELECT.from(Packages)
                        .where({ parent_ID: shipment.ID });
                }

                const totalWeight = packages.reduce(
                    (sum, p) => sum + (Number(p.weight) || 0), 0
                );

                shipment.totalWeight = totalWeight;
                shipment.shippingFee = totalWeight * (rates[shipment.mode] || 0);
            }
            return super.init?.();
        });
    }
};