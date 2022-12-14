sap.ui.define(["sap/ui/test/opaQunit"], opaTest => {
  const Journey = {
    run() {
      QUnit.module("First journey");

      opaTest("Start application", (Given, _When, Then) => {
        Given.iStartMyApp();

        Then.onTheNotificationTypesList.iSeeThisPage();
      });

      opaTest("Navigate to ObjectPage", (_Given, When, Then) => {
        // Note: this test will fail if the ListReport page doesn't show any data
        When.onTheNotificationTypesList.onFilterBar().iExecuteSearch();
        Then.onTheNotificationTypesList.onTable().iCheckRows();

        When.onTheNotificationTypesList.onTable().iPressRow(0);
        Then.onTheNotificationTypesObjectPage.iSeeThisPage();
      });

      opaTest("Teardown", Given => {
        // Cleanup
        Given.iTearDownMyApp();
      });
    }
  };

  return Journey;
});
