import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { writeFile, readFile } from 'fs';
import { CollectionNames } from './database.enums';
import { BASE_PATH_TO_DB_FILE } from './database.constants';
import {promisify} from 'util';
import * as path from 'path';

const readFilePromisify = promisify(readFile);
const writeFilePromisify = promisify(writeFile);

@Injectable()
export class DatabaseService {

    private async readDB():Promise<Object>{
        const data = await readFilePromisify(path.join(__dirname, BASE_PATH_TO_DB_FILE))
        const parsedData: Object = JSON.parse(data.toString());
        return parsedData;
    }


    async createDocument<T extends Object>(collectionName: CollectionNames, document: T):Promise<T & {_id: string;}> {
        const dataDB = await this.readDB();
        const newItem: T & {
            _id: string;
        } = {_id: uuidv4(), ...document};
        dataDB[collectionName].push(newItem);
        await writeFilePromisify(path.join(__dirname, BASE_PATH_TO_DB_FILE), JSON.stringify(dataDB, null, 2));
        return newItem;
    }

    async findEq<T extends {_id: string}>(collectionName: CollectionNames, fieldName: string, fieldValue:unknown ):Promise<T|null>{
        const dataDB: Object = await this.readDB();

        if(!Array.isArray(dataDB[collectionName])){
            throw new Error(`Collection "${collectionName}" doesn't exist`);
        }

        return dataDB[collectionName].find(document=>document[fieldName] === fieldValue) || null;
    }

    async findAll<T extends {_id: string}>(collectionName: CollectionNames):Promise<T[]>{
        const dataDB: Object = await this.readDB();

        if(!Array.isArray(dataDB[collectionName])){
            throw new Error(`Collection "${collectionName}" doesn't exist`);
        }

        return dataDB[collectionName];
    }
    
}
