import { Server } from "socket.io";
import { Redis } from "ioredis";
import { RedisCredentials } from "../constants";
import prismaClient from "./prisma";

const pub = new Redis(RedisCredentials);
const sub = new Redis(RedisCredentials);


class SocketService {
    private _io: Server;

    constructor() {
        console.log('Init Socket Service');
        this._io = new Server({
            cors: {
                allowedHeaders: ['*'],
                origin: '*'
            }
        });

        // all connected users to sockets (when scaled must subscribe to channel MESSAGES)
        sub.subscribe('MESSAGES');
        sub.subscribe('BIDS');
    }

    public startListners() {
        console.log("Start Listners");
        const io = this.io;
        io.on('connect', (socket) => {
            console.log("Socket Connected", socket.id);

            socket.on('event:message', async ({ message }: { message: string }) => {
                console.log('New Message', message);
                // wait and publish to redis
                await pub.publish("MESSAGES", JSON.stringify({ message }));
                console.log(message);
            })

            socket.on('event:bid', async ({ bidAmount }: { bidAmount: number }) => {
                console.log('Bidding amt', bidAmount);
                await pub.publish("BIDS", JSON.stringify({ bidAmount }));
                console.log(JSON.stringify(bidAmount));
            })
        })

        sub.on('message', async (channel, message) => {
            console.log(`Received message on channel ${channel}: ${message}`);
            if (channel === 'MESSAGES') {
                io.emit('message', message);
                await prismaClient.message.create({
                    data: {
                        text: JSON.parse(message).message,
                    }
                })
            } else if (channel === 'BIDS') {
                io.emit('bid', message);
                console.log(`Bid Amount: ${message}`);
                await prismaClient.bid.create({
                    data: {
                        amount: JSON.parse(message).bidAmount,
                    }
                });
            }
        });
    }


    get io(): Server { return this._io }
}


export default SocketService;