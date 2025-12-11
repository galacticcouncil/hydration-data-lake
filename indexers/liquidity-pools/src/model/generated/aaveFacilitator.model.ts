import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class AaveFacilitator {
    constructor(props?: Partial<AaveFacilitator>) {
        Object.assign(this, props)
    }

    /**
     * <facilitator_h160_address>
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    label!: string

    @BooleanColumn_({nullable: false})
    isRemoved!: boolean
}
