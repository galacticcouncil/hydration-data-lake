import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {OperationStackElement, fromJsonOperationStackElement} from "./_operationStackElement"

@Entity_()
export class OperationStack {
  constructor(props?: Partial<OperationStack>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => marshal.fromList(obj, val => fromJsonOperationStackElement(val))}, nullable: false})
  stackElements!: (OperationStackElement)[]
}
