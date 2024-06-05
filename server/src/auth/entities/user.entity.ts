import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from '../../course/entities/course.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
    STUDENT = 'student',
    PROFESSOR = 'professor',
    COORD = 'coordinator',
    ADMIN = 'admin',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 12 })
    code: string;

    @Column({ unique: true, length: 8 })
    dni: string;

    @Column({ unique: true, type: 'varchar', length: 50 })
    email: string;

    @Column({ type: 'varchar', length: 9, nullable: true })
    phone: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    career: string;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 50 })
    lastname: string;

    @Column()
    @Exclude() // Exclude the password from the response. Works with the class-transformer package.
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
    @Exclude() // Exclude the role from the response. Class-transformer package can be set locally or globally.
    role: UserRole;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @OneToMany((_type) => Course, (course) => course.professor, {})
    courses: Course[];
}
