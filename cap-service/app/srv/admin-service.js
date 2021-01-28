
const { ApplicationService } = require('@sap/cds')
module.exports = class AdminService extends ApplicationService {

  async init() {
    this.before('CREATE', 'Faqs', (req) => {
      req.data.count = 0;
      req.data.answer = "";
      req.data.state = "open";
    })
    await super.init()
  }
}