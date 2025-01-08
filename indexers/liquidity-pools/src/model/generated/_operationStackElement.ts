import {OperationStackElementBatch} from "./_operationStackElementBatch"
import {OperationStackElementDca} from "./_operationStackElementDca"
import {OperationStackElementOmnipool} from "./_operationStackElementOmnipool"
import {OperationStackElementRouter} from "./_operationStackElementRouter"
import {OperationStackElementXcm} from "./_operationStackElementXcm"
import {OperationStackElementXcmExchange} from "./_operationStackElementXcmExchange"

export type OperationStackElement = OperationStackElementBatch | OperationStackElementDca | OperationStackElementOmnipool | OperationStackElementRouter | OperationStackElementXcm | OperationStackElementXcmExchange

export function fromJsonOperationStackElement(json: any): OperationStackElement {
  switch(json?.isTypeOf) {
    case 'OperationStackElementBatch': return new OperationStackElementBatch(undefined, json)
    case 'OperationStackElementDca': return new OperationStackElementDca(undefined, json)
    case 'OperationStackElementOmnipool': return new OperationStackElementOmnipool(undefined, json)
    case 'OperationStackElementRouter': return new OperationStackElementRouter(undefined, json)
    case 'OperationStackElementXcm': return new OperationStackElementXcm(undefined, json)
    case 'OperationStackElementXcmExchange': return new OperationStackElementXcmExchange(undefined, json)
    default: throw new TypeError('Unknown json object passed as OperationStackElement')
  }
}
