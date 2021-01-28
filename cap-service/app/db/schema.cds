using {
  managed,
  sap
} from '@sap/cds/common';
using {cuid} from '@sap/cds/common';


namespace sap.demo.faq;

entity Faqs : cuid {
  title    : localized String(111) @(title : '{i18n>Question}');
  descr    : localized String(1111)@(title : '{i18n>Description}');
  author   : Association to Authors;
  answer   : localized String(1111)@(title : '{i18n>Answer}');
  category : Association to Categories;
  state    : String enum {
    open;
    answered;
    duplicate;
  };
  count    : Integer               @(title : '{i18n>Views}');
}

annotate Faqs with {
  ID     @title : '{i18n>ID}';
  state  @title : '{i18n>State}';
}

entity Authors : cuid {
  name : String(111)@(title : '{i18n>Name}');
  faqs : Association to many Faqs
           on faqs.author = $self;
}

annotate Authors with {
  ID @title : '{i18n>ID}';
}

/**
 * Hierarchically organized Code List for Genres
 */
entity Categories : sap.common.CodeList {
  key ID       : Integer    @(title : '{i18n>ID}');
      name     : String(111)@(title : '{i18n>Name}');
      parent   : Association to Categories;
      children : Composition of many Categories
                   on children.parent = $self;
}

entity TypeChecks : cuid {
  type_Boolean     : Boolean      @(title : '{i18n>type_Boolean}');
  type_Int32       : Integer      @(title : '{i18n>type_Int32}');
  type_Int64       : Integer64    @(title : '{i18n>type_Int64}');
  type_Decimal     : Decimal(2, 1)@(title : '{i18n>type_Decimal}');
  type_Double      : Double       @(title : '{i18n>type_Double}');
  type_Date        : Date         @(title : '{i18n>type_Date}');
  type_Time        : Time         @(title : '{i18n>type_Time}');
  type_DateTime    : DateTime     @(title : '{i18n>type_DateTime}');
  type_Timestamp   : Timestamp    @(title : '{i18n>type_Timestamp}');
  type_String      : String       @(title : '{i18n>type_String}');
  type_Binary      : Binary(100)  @(title : '{i18n>type_Binary}');
  type_LargeBinary : LargeBinary  @(title : '{i18n>type_LargeBinary}');
  type_LargeString : LargeString  @(title : '{i18n>type_LargeString}');
};
