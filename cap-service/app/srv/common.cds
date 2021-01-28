/*
	Common Annotations shared by all apps
*/

using { sap.demo.faq as my } from '../db/schema.cds';


////////////////////////////////////////////////////////////////////////////
//
//	FAQ Lists
//
annotate my.Faqs with{
	author @ValueList.entity:'Authors';
	category @ValueList.entity:'Categories';
};

////////////////////////////////////////////////////////////////////////////
//
//	Faqs Elements
//
annotate my.Faqs with {
	category  @title:'{i18n>Category}'  @Common: { Text: category.name,  TextArrangement: #TextOnly };
	author @title:'{i18n>Author}' @Common: { Text: author.name, TextArrangement: #TextOnly };
}

////////////////////////////////////////////////////////////////////////////
//
//	Categories 
//
annotate my.Categories with @(
	UI: {
		SelectionFields: [ name ],
		HeaderInfo: {
			TypeName: '{i18n>Category}',
			TypeNamePlural: '{i18n>Categories}',
			Title: {Value: name},
		},
		LineItem:[
			{Value: ID},
			{Value: name},
		],
	}
);


////////////////////////////////////////////////////////////////////////////
//
//	Authors 
//
annotate my.Authors with @(
	Common.SemanticKey: [name],
	UI: {
		Identification: [{Value:name}],
		SelectionFields: [ name ],
		HeaderInfo: {
			TypeName: '{i18n>Author}',
			TypeNamePlural: '{i18n>Authors}',
			Title: {Value: name},
		},
		LineItem:[
			{Value: ID},
			{Value: name},
		],
	}
);


////////////////////////////////////////////////////////////////////////////
//
//	Languages List
//
annotate common.Languages with @(
	Common.SemanticKey: [code],
	Identification: [{Value:code}],
	UI: {
		SelectionFields: [ name, descr ],
		LineItem:[
			{Value: code},
			{Value: name},
		],
	}
);

////////////////////////////////////////////////////////////////////////////
//
//	Language Details
//
annotate common.Languages with @(
	UI: {
		HeaderInfo: {
			TypeName: '{i18n>Language}',
			TypeNamePlural: '{i18n>Languages}',
			Title: {Value: name},
			Description: {Value: descr}
		},
		Facets: [
			{$Type: 'UI.ReferenceFacet', Label: '{i18n>Details}', Target: '@UI.FieldGroup#Details'},
		],
		FieldGroup#Details: {
			Data: [
				{Value: code},
				{Value: name},
				{Value: descr}
			]
		},
	}
);
