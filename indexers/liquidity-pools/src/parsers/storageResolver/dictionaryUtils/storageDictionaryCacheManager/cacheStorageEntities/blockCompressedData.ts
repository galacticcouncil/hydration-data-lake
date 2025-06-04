import {
  Column,
  Entity,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm';

export interface BlockCompressedDataPayload {
  id: string;
  algo: string;
  compStrFormat: string;
  data: string;
  paraBlockHeight: number;
}

@Entity()
export class BlockCompressedData {
  @PrimaryColumn()
  id!: string;

  @Index()
  @Column({ nullable: false })
  dictionaryTopic!: string;

  @Column({
    nullable: false,
    type: 'jsonb',
  })
  data!: BlockCompressedDataPayload;

  @Column({
    nullable: false,
    name: 'para_block_number',
  })
  paraBlockNumber!: number;
}
