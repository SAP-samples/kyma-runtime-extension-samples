using {sap.capire.orders as ord} from '../db/schema';
using {sap.common as cur} from '../db/schema';
using {
  cuid,
  Currency
} from '@sap/cds/common';

@requires : 'authenticated-user'
service OrdersService {

  entity Orders     as projection on ord.Orders
  entity Currencies as projection on cur.Currencies

  action external(orderNo : Integer) returns {
    affectedRows : String;
    orders : array of {
      ID : String
    }
  }
}

// service ExternalService {
//   action orders(orderNo : Integer) returns {
//     OrderNo : Integer;
//     createdBy : String;
//     buyer : String;
//     currency : Currency;
//     Items : Association to many Items
//   }
// }

// entity Items : cuid {
//   product_ID : Integer;
//   quantity   : Integer;
//   title      : String;
//   price      : Integer;
// }
