/*
Description: This file contains the entity for product, It describes the fields of product table
Auther: Divyani Anerao
*/
import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity('products')
export class Products {

    @PrimaryColumn()
    @PrimaryGeneratedColumn('increment')
    productId : number;

    @Column({type: "text", nullable: true})
    productName : string;

    @Column({type: "int", nullable: true})
    stock : number;

    @Column({type: "int", nullable: true})
    minRequiredStock : number;

    @Column({type: "int", nullable: true})
    stockPercentage : number;

    @Column({type: "int", nullable: true})
    mailSentFlag : number;

}
