import { TopTIcon } from '../Sidebar/İcons';
import TweetBox from '../TweetBox/TweetBox';
import Tweets from '../Tweets/Tweets';
import { useState, useRef, useEffect } from 'react';

export default function ContainerPage() {
    const [thread_blocks, setBlocks] = useState([
        {
            id: 1,
            subheader: "",
            body: "",
        }
    ]);
    const [indices, setIndices] = useState([1]);
    const [published_blocks, setPublished] = useState([]);

    return(
        <>
            <header className="sticky-top flex justify-between items-center p-4 border-b border-primary-container_border_color bg-black">
                <span className="font-bold text-xl text-white">Home</span>
                <div className="flex items-center justify-center w-9 h-9 rounded-full transform transition-colors duration-2 hover:bg-gray-700 hover:bg-opacity-70 cursor-pointer">
                    <a title="Top Tweets">
                        <TopTIcon/>
                    </a>
                </div>
            </header>
            <div className="flex space-x-4 px-5 py-2 border-b border-primary-container_border_color">
                    <img className="rounded-full h-11 w-11 mt-1" src="https://pbs.twimg.com/media/FDfHu8tVEAQAVfv?format=jpg&name=large"/>
                    <TweetBox blocks={[thread_blocks, setBlocks]} indices={[indices, setIndices]} tweets={[published_blocks, setPublished]}/>
            </div>
            <div>
                    <Tweets blocks={[thread_blocks, setBlocks]} indices={[indices, setIndices]} tweets={[published_blocks, setPublished]}/>
            </div>
        </>
    )
}