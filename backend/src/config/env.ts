import dotenv from 'dotenv';
import path from 'path';
import dotenvExpand from "dotenv-expand";
import fs from 'fs';

const homeEnv = dotenv.config({ path: path.resolve(process.cwd() + '/../' || '', '.env') });
dotenvExpand.expand(homeEnv);

const localEnv = dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenvExpand.expand(localEnv);
