# Contributing to Kyma Extension Samples

You want to contribute to OpenUI5? Welcome! Please read this document to understand what you can do:

 * [Help Others](#help-others)
 * [Analyze Issues](#analyze-issues)
 * [Report an Issue](#report-an-issue)
 * [Contribute Code](#contribute-code)

## Help Others

You can help Kyma Runtime by helping others who use Kyma Runtime and need support. You will find them in the [SAP BTP, Kyma runtime Community](https://answers.sap.com/tags/73554900100800003012).

## Analyze Issues

Analyzing issue reports can be a lot of effort. Any help is welcome!
Go to [the Github issue tracker](https://github.com/SAP-samples/kyma-runtime-extension-samples/issues?q=is%3Aopen) and find an open issue which needs additional work or a bugfix.

Additional work may be further information, or a minimized jsbin example or gist, or it might be a hint that helps understanding the issue. Maybe you can even find and [contribute](#contribute-code) a bugfix?

## Report an Issue

If you find an issue with the sample, please open a Github Issue.

## Contribute Code

You are welcome to contribute code to OpenUI5 in order to fix bugs or to implement new features.

There are three important things to know:

1.  You must be aware of the Apache License (which describes contributions) and **agree to the Developer Certificate of Origin**. This is common practice in all major Open Source projects. To make this process as simple as possible, we are using *[CLA assistant](https://cla-assistant.io/)*. CLA assistant is an open source tool that integrates with GitHub very well and enables a one-click-experience for accepting the DCO. See the respective section below for details.
2.  There are **several requirements regarding code style, quality, and product standards** which need to be met (we also have to follow them). The respective section below gives more details on the coding guidelines.
3.  **Not all proposed contributions can be accepted**. Some features may e.g. just fit a third-party add-on better. The code must fit the overall direction of OpenUI5 and really improve it, so there should be some "bang for the byte". For most bug fixes this is a given, but major feature implementation first need to be discussed with one of the OpenUI5 committers (the top 20 or more of the [Contributors List](https://github.com/SAP/openui5/graphs/contributors)), possibly one who touched the related code recently. The more effort you invest, the better you should clarify in advance whether the contribution fits: the best way would be to just open an enhancement ticket in the issue tracker to discuss the feature you plan to implement (make it clear you intend to contribute). We will then forward the proposal to the respective code owner, this avoids disappointment.

### Developer Certificate of Origin (DCO)

Due to legal reasons, contributors will be asked to accept a DCO before they submit the first pull request to this project. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).  
This happens in an automated fashion during the submission process: the CLA assistant tool will add a comment to the pull request. Click it to check the DCO, then accept it on the following screen. CLA assistant will save this decision for upcoming contributions.

This DCO replaces the previously used CLA ("Contributor License Agreement") as well as the "Corporate Contributor License Agreement" with new terms which are well-known standards and hence easier to approve by legal departments. Contributors who had already accepted the CLA in the past may be asked once to accept the new DCO.

### Contribution Content Guidelines

Contributed content can be accepted if it:

1. is useful to improve OpenUI5 (explained above)
2. follows the applicable guidelines and standards

The second requirement could be described in entire books and would still lack a 100%-clear definition, so you will get a committer's feedback if something is not right. Extensive conventions and guidelines documentation is [available here](docs/guidelines.md).

These are some of the most important rules to give you an initial impression:

-   Apply a clean coding style adapted to the surrounding code, even though we are aware the existing code is not fully clean
-   Use tabs for indentation (except if the modified file consistently uses spaces)
-   Use variable and CSS class naming conventions like in the other files you are seeing (e.g. hungarian notation)
-   No global variables, of course, and [use "jQuery" instead of "$"](http://learn.jquery.com/using-jquery-core/avoid-conflicts-other-libraries/)
-   No console.log() - use jQuery.sap.log.\*
-   Run the ESLint code check and make it succeed
-   Use jQuery.sap.byId("someId") instead of jQuery("\#someId") - certain characters in IDs need to be escaped for jQuery to work correctly
-   Only access public APIs of other entities (there are exceptions, but this is the rule)
-   Comment your code where it gets non-trivial and remember to keep the public JSDoc documentation up-to-date
-   Controls need to be accessible (operable by keyboard and read properly by screenreaders, through ARIA support), support right-to-left languages, and run fine in all supported browsers/devices
-   Translation and Localization must be supported
-   Keep databinding in mind - users expect it to work for basically everything
-   Keep an eye on performance and memory consumption, properly destroy objects when not used anymore (e.g. avoid ancestor selectors in CSS)
-   Try to write slim and "modern" HTML and CSS, avoid using images and affecting any non-UI5 content in the page/app
-   Avoid `!important` in the CSS files and don't apply outer margins to controls; make them work also when positioned absolutely
-   Do not use oEvent.preventDefault(); or oEvent.stopPropagation(); without a good reason or without documentation why it is really required
-   Write a unit test
-   Do not do any incompatible changes, especially do not modify the name or behavior of public API methods or properties
-   Always consider the developer who USES your control/code!
    -   Think about what code and how much code he/she will need to write to use your feature
    -   Think about what she/he expects your control/feature to do

If this list sounds lengthy and hard to achieve - well, that's what WE have to comply with as well, and it's by far not complete…

### How to contribute - the Process

1.  Make sure the change would be welcome (e.g. a bugfix or a useful feature); best do so by proposing it in a GitHub issue
2.  Create a branch forking the openui5 repository and do your change
3.  Commit and push your changes on that branch
    -   When you have several commits, squash them into one (see [this explanation](http://davidwalsh.name/squash-commits-git)) - this also needs to be done when additional changes are required after the code review

4.  In the commit message follow the [commit message guidelines](docs/guidelines.md#git-guidelines)
5.  If your change fixes an issue reported at GitHub, add the following line to the commit message:
    - ```Fixes https://github.com/SAP/openui5/issues/(issueNumber)```
    - Do NOT add a colon after "Fixes" - this prevents automatic closing.
	- When your pull request number is known (e.g. because you enhance a pull request after a code review), you can also add the line ```Closes https://github.com/SAP/openui5/pull/(pullRequestNumber)```
6.  Create a Pull Request to github.com/SAP/openui5
7.  Follow the link posted by the CLA assistant to your pull request and accept the Developer Certificate of Origin, as described in detail above.
8.  Wait for our code review and approval, possibly enhancing your change on request
    -   Note that the UI5 developers also have their regular duties, so depending on the required effort for reviewing, testing and clarification this may take a while

9.  Once the change has been approved we will inform you in a comment
10.  Your pull request cannot be merged directly into the branch (internal SAP processes), but will be merged internally and immediately appear in the public repository as well. Pull requests for non-code branches (like "gh-pages" for the website) can be directly merged.
11.  We will close the pull request, feel free to delete the now obsolete branch