import React from "react";
import { Observable } from 'rxjs';
declare const W3bContext: React.Context<any>;
export declare const useObservable: (observable: Observable<any>) => undefined[];
declare const W3bProvider: ({ children }: any) => import("react/jsx-runtime").JSX.Element;
export { W3bContext, W3bProvider };
