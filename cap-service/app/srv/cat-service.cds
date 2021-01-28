using {sap.demo.faq as my} from '../db/schema';


service CatalogService {
  entity Faqs @(restrict : [ //Don't use @readonly as it's not supported by privileged user
  {
    grant : ['READ'],
    to    : 'any'
  }]) as projection on my.Faqs;


  entity Categories @(restrict : [ //Don't use @readonly as it's not supported by privileged user
  {
    grant : ['READ'],
    to    : 'any'
  }]) as projection on my.Categories;


  entity Authors @(restrict : [ //Don't use @readonly as it's not supported by privileged user
  {
    grant : ['READ'],
    to    : 'any'
  }]) as projection on my.Authors;
}
