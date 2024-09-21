import React, { useCallback, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

interface SocketProviderProps {
    children?: React.ReactNode;
}

interface ISocketContext {
    sendMessage: (msg: string) => any,
    makeBid: (bid: number) => any,
    messages: string[],
    bidAmounts: number[],
    socketId: string | undefined,
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) throw new Error('state is undefined');

    return state;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {

    const [socket, setSocket] = useState<Socket>()
    const [messages, setMessages] = useState<string[]>([])
    const [bidAmounts, setBidAmounts] = useState<number[]>([])
    const [socketId, setSocketId] = useState<string | undefined>('123')

    const sendMessage: ISocketContext['sendMessage'] = useCallback((msg) => {
        console.log('Send Message: ', msg);
        if (socket) {
            socket.emit('event:message', { message: msg });
        }
    }, [socket]);

    const makeBid: ISocketContext['makeBid'] = useCallback((bid) => {
        console.log('Bid Client', bid);
        if (socket) {
            socket.emit("event:bid", { bidAmount: bid });
        }
    }, [socket])

    const onMessage = useCallback((msg: string) => {
        console.log('Redis message', msg);
        const { message } = JSON.parse(msg) as { message: string };
        setMessages((prev) => [...prev, message])
    }, [])

    const onBid = useCallback((bid: string) => {
        console.log('Redis bid', bid);
        const { bidAmount } = JSON.parse(bid) as { bidAmount: number };
        setBidAmounts((prev) => [...prev, bidAmount]);
    }, []);

    useEffect(() => {
        const _socket = io('http://localhost:8000');
        _socket.on('bid', onBid);
        _socket.on('message', onMessage);
        setSocket(_socket);
        _socket.on('connect', () => {
            setSocketId(_socket.id);
        });

        return () => {
            _socket.off('bid', onBid);
            _socket.off('message', onMessage);
            _socket.disconnect();
            setSocket(undefined);
        }
    }, [onBid, onMessage])


    return (
        <SocketContext.Provider value={{ sendMessage, messages, makeBid, bidAmounts, socketId }}>
            {children}
        </SocketContext.Provider>
    );
}


export default SocketContext;