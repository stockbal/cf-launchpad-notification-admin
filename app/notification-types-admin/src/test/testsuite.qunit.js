window.suite = function () {
  // eslint-disable-next-line
  const oSuite = new parent.jsUnitTestSuite();
  const sContextPath = location.pathname.substring(
    0,
    location.pathname.lastIndexOf("/") + 1
  );
  oSuite.addTestPage(sContextPath + "integration/opaTests.qunit.html");

  return oSuite;
};
