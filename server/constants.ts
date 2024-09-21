import 'dotenv/config'
import { RedisOptions } from 'ioredis'


export const RedisCredentials: RedisOptions = {
    host: process.env.REDIS_HOST,
    port: 5003,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
}