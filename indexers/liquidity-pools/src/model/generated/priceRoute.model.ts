import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"

@Entity_()
export class PriceRoute {
    constructor(props?: Partial<PriceRoute>) {
        Object.assign(this, props)
    }

    /**
     * SHA256 hash of the route array
     */
    @PrimaryColumn_()
    id!: string

    @Column_("jsonb", {transformer: {to: obj => obj, from: obj => obj == null ? undefined : marshal.fromList(obj, val => marshal.fromList(val, val => marshal.string.fromJSON(val)))}, nullable: false})
    route!: ((string)[])[]

    @StringColumn_({array: true, nullable: false})
    poolAddresses!: (string)[]

    @StringColumn_({array: true, nullable: false})
    assetPath!: (string)[]

    @IntColumn_({nullable: false})
    hopCount!: number
}
