/*
Description: This file contains the entity for order, It describes the fields of order table
Auther: Divyani Anerao
*/
import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity('orders')
export class Orders {

    @PrimaryColumn()
    @PrimaryGeneratedColumn('increment')
    orderId : number;

    @Column({type: "int", nullable: false})
    productId : number;

    @Column({type: "int", nullable: false})
    quantity : number;

    @Column({type: "text", nullable: false})
    buyerName : string;

    @Column({type: "int", nullable: true})
    buyerPhoneNumber : number;

    @Column({type: "timestamp", nullable: true})
    orderedAt : Date;

}
