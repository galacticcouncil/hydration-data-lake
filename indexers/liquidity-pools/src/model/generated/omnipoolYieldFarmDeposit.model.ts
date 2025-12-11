import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, Index as Index_} from "@subsquid/typeorm-store"
import * as marshal from "./marshal"
import {YieldFarmDepositStatus} from "./_yieldFarmDepositStatus"
import {OmnipoolYieldFarmEntry} from "./_omnipoolYieldFarmEntry"

@Entity_()
export class OmnipoolYieldFarmDeposit {
    constructor(props?: Partial<OmnipoolYieldFarmDeposit>) {
        Object.assign(this, props)
    }

    /**
     * deposit ID
     */
    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    depositNftId!: string

    @StringColumn_({nullable: false})
    globalFarmId!: string

    @StringColumn_({nullable: false})
    yieldFarmId!: string

    @StringColumn_({nullable: false})
    positionId!: string

    @StringColumn_({nullable: false})
    accountId!: string

    @StringColumn_({nullable: false})
    assetId!: string

    /**
     * should be either SharesDeposited or DepositDestroyed
     */
    @Column_("varchar", {length: 17, nullable: false})
    status!: YieldFarmDepositStatus

    @BigIntColumn_({nullable: false})
    sharesAmount!: bigint

    @Column_("jsonb", {transformer: {to: obj => obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new OmnipoolYieldFarmEntry(undefined, marshal.nonNull(val)))}, nullable: false})
    entries!: (OmnipoolYieldFarmEntry)[]

    @Index_()
    @IntColumn_({nullable: false})
    createdAtParaBlockHeight!: number

    @Index_()
    @IntColumn_({nullable: true})
    destroyedAtParaBlockHeight!: number | undefined | null
}
