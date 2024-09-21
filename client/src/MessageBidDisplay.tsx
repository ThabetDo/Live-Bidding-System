import React, { useState, useEffect, useRef } from 'react';

interface MessageBidProps {
    messages: string[];
    bidAmounts: number[];
}

function MessageBidDisplay({ messages, bidAmounts }: MessageBidProps) {
    const [displayedMessage, setDisplayedMessage] = useState('');
    const [displayedBid, setDisplayedBid] = useState(0);
    const messageIndex = useRef(0);
    const bidIndex = useRef(0);

    useEffect(() => {
        const displayNextMessage = () => {
            if (messageIndex.current < messages.length) {
                setDisplayedMessage(messages[messageIndex.current]);
                messageIndex.current++;
            }
        };

        const displayNextBid = () => {
            if (bidIndex.current < bidAmounts.length) {
                setDisplayedBid(bidAmounts[bidIndex.current]);
                bidIndex.current++;
            }
        };

        // Display initial content and handle subsequent updates
        displayNextMessage();
        displayNextBid();

        // Optional: Interval to simulate asynchronous updates (adjust as needed)
        const intervalId = setInterval(() => {
            displayNextMessage();
            displayNextBid();
        }, 2000); // Replace 2000 with your desired interval in milliseconds

        return () => clearInterval(intervalId); // Clean up interval on unmount
    }, [messages, bidAmounts]);

    return (
        <div>
            {displayedMessage && (
                <p key={`message-${messageIndex.current}`}>
                    Message from user (assumed data source) is -
                    <br />
                    {displayedMessage}
                </p>
            )}
            {displayedBid && (
                <p key={`bid-${bidIndex.current}`}>
                    Bid from user (assumed data source) is -
                    <br />
                    {displayedBid}
                </p>
            )}
        </div>
    );
}

export default MessageBidDisplay;
