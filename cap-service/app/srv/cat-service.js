
const { ApplicationService, PrivilegedUser } = require('@sap/cds')
module.exports = class CatalogService extends ApplicationService {

  async init() {
    const user = new cds.User.Privileged();
    const catSvc = this;

    const { Faqs } = catSvc.entities;

    this.after('READ', 'Faqs', async (results) => {
      if (results.length === 1) { // Only increment if only one service is being accessed
        const faq = results[0];
        const tx = catSvc.transaction({ user });

        tx.run(
          UPDATE(Faqs).set({ count: { '+=': 1 } }).where({ ID: faq.ID })
        ).then(() => tx.commit())
      }
    })
    await super.init()
  }
}