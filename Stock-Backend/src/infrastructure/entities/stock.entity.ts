import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StockEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public stockname: string;

  @Column({ unique: true })
  public description: string;

  @Column()
  public currentValue: number;

  @Column()
  public initialPrice: number;

  @Column()
  public initialDate: string;
}

export default StockEntity;
