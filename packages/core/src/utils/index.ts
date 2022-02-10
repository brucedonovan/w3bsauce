import { Subject } from "rxjs";
import { ProviderRpcError } from "../types/eip1193";

/**
 *
 * converts a map of provider functions in to an object
 * with errors subscribed to errors subject
 *
 * */
export const mapToErrorHandledObject = (
  asyncFunctionMap: Map<string, Function>,
  errorSubject: Subject<ProviderRpcError>
) =>
  Array.from(asyncFunctionMap).reduce((obj: any, [key, value]: any) => {
    obj[key] = (...args: any) =>
      value(...args).catch((err: any) => errorSubject.next(err));
    return obj;
  }, {});
