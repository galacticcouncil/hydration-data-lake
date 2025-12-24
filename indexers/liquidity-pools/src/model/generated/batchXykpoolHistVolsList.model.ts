import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  Index as Index_,
} from 'typeorm';

@Entity_()
export class BatchXykpoolHistVolsList {
  constructor(props?: Partial<BatchXykpoolHistVolsList>) {
    Object.assign(this, props);
  }

  /**
   * <batchStartParaBlockHeight> (e.g. 101312)
   */
  @PrimaryColumn_()
  id!: string;

  @Column_('text', { array: true, nullable: true })
  poolIds!: string[] | undefined | null;

  @Index_()
  @Column_('int4', { nullable: false })
  batchStartParaBlockHeight!: number;

  @Index_()
  @Column_('int4', { nullable: false })
  batchEndParaBlockHeight!: number;
}
