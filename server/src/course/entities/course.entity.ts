import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Course {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar' })
    semester: string;

    @Column({ type: 'varchar' })
    cycle: string;

    @Column({ type: 'varchar', length: 100 })
    career: string;

    @Column({ type: 'varchar', nullable: true })
    silabo_pdf: string;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @ManyToOne((_type) => User, (professor) => professor.courses, {
        eager: true,
    })
    professor: User;
}
