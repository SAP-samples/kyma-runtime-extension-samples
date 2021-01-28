/**
 * OData Admin Servic for FAQs
 */
using {sap.demo.faq as my} from '../db/schema';

service AdminService {
  @odata.draft.enabled
  entity Faqs                as projection on my.Faqs;

  @odata.draft.enabled
  entity Authors             as projection on my.Authors;

  @odata.draft.enabled
  entity Categories          as projection on my.Categories;

  @odata.draft.enabled
  entity TypeChecksWithDraft as projection on my.TypeChecks;
}
