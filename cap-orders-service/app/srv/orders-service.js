const { ApplicationService, connect } = require("@sap/cds");

module.exports = class OrdersService extends ApplicationService {
  async init() {
    this.on("external", async (req) => {
      try {
        const orders = await connect.to("ExternalOrders");
        const data = await orders.tx(req).post("/orders", req.data);

        const tx = cds.tx(req);
        const srv = await cds.connect.to("OrdersService");
        const { Orders } = srv.entities;

        const result = await tx.send({
          query: INSERT.into(Orders, data),
        });

        const ids = [];
        for (const id of result) {
          ids.push(id);
        }

        return {
          affectedRows: result.valueOf(),
          orders: ids,
        };
      } catch (err) {
        throw err;
      }
    });

    await super.init();
  }
};
