import React, { useState, useEffect, useRef } from 'react';
import { ApolloClient, InMemoryCache, useQuery, useMutation, gql, ApolloProvider } from '@apollo/client';
import avatar1 from '../img/latin-women.jpg';
import { MdOutlineSend } from "react-icons/md";
import { RiCheckDoubleLine } from "react-icons/ri";

const client = new ApolloClient({
    uri: 'https://server-kharev-kharevs-projects.vercel.app/',
    cache: new InMemoryCache(),
});

const GET_MESSAGES = gql`
    query {
        messages {
            id
            user
            content
        }
    }
`;

const POST_MESSAGE = gql`
    mutation ($user: String!, $content: String!) {
        postMessage(user: $user, content: $content)
    }
`;

const Messages = ({ user, setTalkingTo }) => {
    const { data } = useQuery(GET_MESSAGES, { pollInterval: 500 });
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [data]);

    useEffect(() => {
        if (data && data.messages.length > 0) {
            const otherUserMessages = data.messages.filter(msg => msg.user !== user);
            if (otherUserMessages.length > 0) {
                setTalkingTo(otherUserMessages[otherUserMessages.length - 1].user);
            }
        }
    }, [data, user, setTalkingTo]);

    if (!data) {
        return null;
    }

    return (
        <>
            {data.messages.map(({ id, user: messageUser, content }) => (
                <div
                    key={id}
                    className={`flex ${user === messageUser ? 'justify-end' : 'justify-start'} mb-4`}
                >
                    {user !== messageUser && (
                        <div
                            className="flex-shrink-0 h-12 w-12 mr-2 rounded-full text-center font-normal flex items-center justify-center"
                        >
                            <img src={avatar1} alt="User Avatar" className="w-12 h-12 rounded-full object-cover" />
                        </div>
                    )}
                    <div
                        className={`p-3 rounded-xl max-w-xs ${user === messageUser ? 'bg-light-blue text-white font-normal' : 'bg-light-green text-white font-normal'}`}
                    >
                        {content}
                        <div className="flex justify-between text-xs text-gray-200 mt-1 pt-1 pb-1 font-normal">
                            <span>{new Date().toLocaleTimeString()}</span>
                            {user === messageUser && (
                                <span className="text-gray-200-800 pl-2"><RiCheckDoubleLine /></span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </>
    );
};


const Chat = () => {
    const [user, setUser] = useState('Jack');
    const [content, setContent] = useState('');
    const [talkingTo, setTalkingTo] = useState('');

    const [postMessage] = useMutation(POST_MESSAGE);

    const onSend = () => {
        if (content.length > 0) {
            postMessage({
                variables: { user, content },
            });
            setContent('');
        }
    };

    return (
        <div className="lg:flex h-screen">

            <div className="hidden lg:flex lg:w-1/4 bg-red-500 border-2 border-black flex-col items-center p-4">
                <div className="bg-white p-2 rounded-lg w-full flex items-center mb-4 cursor-pointer">
                    <img src={avatar1} alt="User Avatar" className="w-12 h-12 rounded-full mr-2 object-cover" />
                    <span className="text-black text-xl">{talkingTo || "No one yet"}</span>
                </div>
            </div>
            <div className="relative w-full lg:w-4/5 bg-light-gray flex flex-col">
                <div className="sticky top-0 w-full bg-white p-2 flex justify-center text-black font-bold text-xl z-10">
                    23BCE1677
                </div>

                <div className="flex-1 overflow-auto p-4 pt-12">
                    <Messages user={user} setTalkingTo={setTalkingTo} />
                </div>
                <div className="p-3 flex items-center space-x-2 bg-white sticky bottom-0">

                    <input
                        type="text"
                        className="w-5/6 px-3 py-2 rounded outline-none bg-slate-100"
                        placeholder="Type your message..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                onSend();
                            }
                        }}
                    />
                    <button
                        className="w-1/12 text-blue-600 py-2 pl-16 text-2xl"
                        onClick={onSend}
                    >
                        <MdOutlineSend />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default () => (
    <ApolloProvider client={client}>
        <Chat />
    </ApolloProvider>
);
