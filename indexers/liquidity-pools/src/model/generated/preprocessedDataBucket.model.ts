import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
} from 'typeorm';

@Entity_()
export class PreprocessedDataBucket {
  constructor(props?: Partial<PreprocessedDataBucket>) {
    Object.assign(this, props);
  }

  /**
   * <uuid>
   */
  @PrimaryColumn_()
  id!: string;

  @Column_('text', { nullable: false })
  processorId!: string;

  @Column_('int4', { nullable: false })
  paraBlockHeight!: number;

  @Column_('text', { nullable: false })
  entityName!: string;

  @Column_('jsonb', { nullable: false })
  data!: unknown;
}
