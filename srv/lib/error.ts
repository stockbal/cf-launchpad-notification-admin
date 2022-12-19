import { AxiosError } from "axios";

type ServiceError = string | { error: string | { message: string | { value: string } } };

export class CustomError {
  public code: number;
  public message: string;

  constructor(message: string, code: number) {
    this.code = code;
    this.message = message;
  }
}

export function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError)?.isAxiosError;
}

export function createError(e: unknown): Error {
  let exception: Error | undefined;

  /*
   * enhance Error objects with property "code" otherwise CAP will overwrite the
   * message with a generic text and the calling clients will not see the custom message
   */
  if (isAxiosError(e)) {
    exception = Object.assign(new Error(getAxiosErrorMessage(e)), {
      code: e.response?.status || 500
    });
  } else if (typeof e === "string") {
    exception = Object.assign(new Error(e), { code: 500 });
  } else if (e instanceof Error) {
    exception = "code" in e ? e : Object.assign(e, { code: 500 });
  }
  return exception || Object.assign(new Error("Request failed"), { code: 500 });
}

function getAxiosErrorMessage(error: AxiosError): string {
  let errorMessage: string | undefined;

  if (error.response && error.response.data) {
    const e = error.response.data as ServiceError;

    if (typeof e === "string") {
      errorMessage = e;
    } else if ("error" in e) {
      if (typeof e.error === "string") {
        errorMessage = e.error;
      } else if ("message" in e.error) {
        if (typeof e.error.message === "string") {
          errorMessage = e.error.message;
        } else if ("value" in e.error.message) {
          errorMessage = e.error.message.value;
        }
      }
    }
  } else if (error.message) {
    errorMessage = error.message;
  }

  if (errorMessage) {
    return errorMessage;
  } else {
    return "Request Failed";
  }
}
