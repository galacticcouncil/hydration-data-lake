import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, Index as Index_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {YieldFarmDepositStatus} from "./_yieldFarmDepositStatus"
import {XykYieldFarmEntry} from "./_xykYieldFarmEntry"

@Entity_()
export class XykYieldFarmDeposit {
    constructor(props?: Partial<XykYieldFarmDeposit>) {
        Object.assign(this, props)
    }

    /**
     * deposit ID
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: true})
    depositNftId!: string | undefined | null

    @StringColumn_({nullable: false})
    xykpoolId!: string

    @StringColumn_({nullable: false})
    accountId!: string

    @StringColumn_({nullable: false})
    lpAssetId!: string

    @BigIntColumn_({nullable: false})
    initialAmount!: bigint

    @BigIntColumn_({nullable: false})
    amount!: bigint

    /**
     * should be either SharesDeposited or DepositDestroyed
     */
    @Column_("varchar", {length: 17, nullable: false})
    status!: YieldFarmDepositStatus

    @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new XykYieldFarmEntry(undefined, marshal.nonNull(val)))}, nullable: false})
    entries!: (XykYieldFarmEntry)[]

    @Index_()
    @IntColumn_({nullable: false})
    createdAtParaBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: true})
    destroyedAtParaBlockHeight!: number | undefined | null
}
