import cds from "@sap/cds";
import { setLogLevel } from "@sap-cloud-sdk/util";

export function getLogger(id: "notification-api" | "account-api" | "ias") {
  return cds.log(id);
}

export function setLogLevels() {
  setLogLevel("error", "env-destination-accessor");
  setLogLevel("error", "destination-accessor-vcap");
  setLogLevel("error", "destination-accessor-service");
  setLogLevel("error", "xsuaa-service");
  setLogLevel("error", "proxy-util");
  setLogLevel("error", "http-client");
  setLogLevel("error", "environment-accessor");
}
