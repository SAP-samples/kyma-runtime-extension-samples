using AdminService from './admin-service';

////////////////////////////////////////////////////////////////////////////
//
//	Faqs Object Page
//

annotate AdminService.Faqs with {
  ID       @Core.Computed;
  descr    @mandatory;
  title    @mandatory;
  author   @mandatory;
  category @mandatory;
  descr    @UI.MultiLineText;
  answer   @UI.MultiLineText;
}

annotate AdminService.Faqs with @(UI : {
  Identification      : [{Value : ID}],
  HeaderInfo          : {
    TypeName       : '{i18n>Faq}',
    TypeNamePlural : '{i18n>Faqs}',
    Title          : {Value : title},
    Description    : {Value : answer},
  },
  SelectionFields     : [
  title,
  author_ID,
  count,
  state
  ],
  LineItem            : [
  {Value : title},
  {Value : answer},
  {Value : descr},
  {Value : category.name},
  {Value : state},
  {Value : count}
  ],
  Facets              : [
  {
    $Type  : 'UI.ReferenceFacet',
    Label  : '{i18n>General}',
    Target : '@UI.FieldGroup#General'
  },
  {
    $Type  : 'UI.ReferenceFacet',
    Label  : '{i18n>Translations}',
    Target : 'texts/@UI.LineItem'
  }
  ],
  FieldGroup #General : {Data : [
  {Value : author_ID},
  {Value : category_ID},
  {Value : descr},
  {Value : count},
  {Value : state}
  ]}
});


////////////////////////////////////////////////////////////
//
//  Draft for Localized Data
//

annotate AdminService.Faqs_texts with @(UI : {
  Identification  : [{Value : title}],
  SelectionFields : [
  locale,
  title
  ],
  LineItem        : [
  {
    Value : locale,
    Label : 'Locale'
  },
  {
    Value : title,
    Label : 'Question'
  },
  {
    Value : descr,
    Label : 'Description'
  }
  ]
});


annotate AdminService.Authors with {
  ID   @Core.Computed;
  name @mandatory;
}

annotate AdminService.Category with {
  name @mandatory;
}
