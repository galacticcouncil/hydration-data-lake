import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  Index as Index_,
} from 'typeorm';

@Entity_()
export class AccountMmPositionHistoricalData {
  constructor(props?: Partial<AccountMmPositionHistoricalData>) {
    Object.assign(this, props);
  }

  /**
   * <address>-<paraBlockHeight>
   */
  @PrimaryColumn_()
  id!: string;

  @Column_('text', { nullable: false })
  accountId!: string;

  @Column_('text', { nullable: true })
  accountBoundEvmAddress!: string | undefined | null;

  @Column_('text', { nullable: false })
  totalCollateralBase!: string;

  @Column_('text', { nullable: false })
  totalDebtBase!: string;

  @Column_('text', { nullable: false })
  availableBorrowsBase!: string;

  @Column_('text', { nullable: false })
  currentLiquidationThreshold!: string;

  @Column_('text', { nullable: false })
  ltv!: string;

  @Column_('text', { nullable: true })
  healthFactor!: string | undefined | null;

  @Column_('text', { nullable: false })
  poolAddress!: string;

  @Index_()
  @Column_('int4', { nullable: false })
  paraBlockHeight!: number;
}
