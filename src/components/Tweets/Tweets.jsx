import { Reply, Retweet, Like, Share, VerifiedBadge } from '../Sidebar/İcons';
import { useState, useRef, useEffect } from 'react';
import { Avatar, Container, Grid, IconButton, Paper, TextField, ThemeProvider, createTheme, styled } from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

export default function Tweets(props) {

    const [indices, setIndices] = props.indices;
    const [pub, setPub] = props.tweets;
    const pub_reverse = pub;
    pub_reverse.reverse();
    const [showSummary, setShow] = useState(new Array(pub.length).fill(0));
    const [bios, setBios] = useState(new Array(pub.length).fill(""));

    const Rectangle = styled(Paper)(({ theme }) => ({
        ...theme.typography.body2,
        textAlign: 'left',
        marginLeft: 30,
        padding: 30,
        variant: 'outlined',
        fill: 'transparent',
        color: theme.palette.text.primary,
        lineHeight: '30px',
    }));

    const Option = styled(Paper)(({ theme }) => ({
        ...theme.typography.body2,
        textAlign: 'left',
        paddingTop: 9,
        paddingBottom: 9,
        paddingLeft: 26,
        variant: 'outlined',
        fill: 'transparent',
        color: theme.palette.text.primary,
        lineHeight: '30px',
    }));

    async function getBios(batch_id) {
        let payload = {};
        payload["batch"] = batch_id;
        let content = [];
        for (let block of pub_reverse[batch_id].blocks) {
            content.push(block.body);
        }
        payload["blocks"] = content;
        fetch("http://127.0.0.1:5000/author-bio", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                let new_bios = bios;
                new_bios[batch_id] = data["bio"];
                setBios(new_bios);
            })
    }

    useEffect(() => {
        for (let batch of pub) {
            getBios(batch.batch);
        }
    }, [])

    console.log(showSummary);

    return (
        <>
            {
                pub.length > 0
                    ? <>
                        <div className="block space-x-3 px-4 py-3 border-b border-primary-container_border_color">
                            {pub_reverse.map((batch) => (
                                <>
                                    <div className="flex-1">
                                        <div className="flex items-center text-sm space-x-2">
                                            <img src="https://pbs.twimg.com/media/FDfHu8tVEAQAVfv?format=jpg&name=large" className="w-11 h-11 rounded-full" />
                                            <span className="ml-1 font-bold text-white">Bradley Tian <VerifiedBadge /></span>
                                            <span className="ml-2 text-primary-gray_colors">@BradleyT12345</span>
                                            <div className="mx-2 text-primary-gray_colors">·</div>
                                            <span className="text-primary-gray_colors">49m</span>
                                        </div>
                                        <div className="ml-1">
                                            <ThemeProvider theme={darkTheme}>
                                                <Container maxWidth={'lg'} sx={{ alignSelf: 'center', marginTop: 5 }}>
                                                    <Grid container spacing={2} columns={12}>
                                                        {
                                                            batch.blocks.map((block) => (
                                                                <Grid item xs={12}>
                                                                    <Rectangle key={1}>
                                                                        <p marginLeft="30px">Thread {block.index}/{batch.blocks.length}</p>
                                                                        <h3 class="font-bold text-md text-white">{block.subheader}</h3>
                                                                        <p>{block.body}</p>
                                                                    </Rectangle>
                                                                </Grid>
                                                            ))
                                                        }
                                                    </Grid>
                                                </Container>
                                            </ThemeProvider>
                                            <ThemeProvider theme={darkTheme}>
                                                <Container maxWidth={'lg'} sx={{ alignSelf: 'center', alignItems: 'center', marginTop: 5 }}>
                                                    <Grid container spacing={2} columns={16}>
                                                        <Grid item xs={16}>
                                                            <Option key={1} elevation={0}>
                                                                <Grid container spacing={2} columns={16}>
                                                                    <Grid item xs={14}>
                                                                        <h3 class="font-bold text-md text-white">Summarize with Grok AI?</h3>
                                                                    </Grid>
                                                                    <Grid item xs={2}>
                                                                        <IconButton
                                                                            sx={{ width: 40, height: 40, color: "#04bb7b" }}
                                                                            onClick={() => { 
                                                                                let summaries = showSummary;
                                                                                summaries[batch.batch] = Math.abs(summaries[batch.batch] - 1);
                                                                                setShow(summaries);
                                                                            }}>
                                                                            <TelegramIcon sx={{ width: '100%', height: '100%' }} />
                                                                        </IconButton>
                                                                    </Grid>
                                                                </Grid>
                                                            </Option>
                                                        </Grid>
                                                        {
                                                            showSummary[batch.batch] === 1
                                                                ? <Grid item xs={16}>
                                                                    <Option key={1} elevation={0}>
                                                                        {
                                                                            batch.summary != ""
                                                                            ? batch.summary : "Loading..."
                                                                        }
                                                                    </Option>
                                                                </Grid> : <></>
                                                        }
                                                        <Grid item xs={16}>
                                                            <Option key={1} elevation={0}>
                                                                <h3 class="font-bold text-md text-white">About the author:</h3>
                                                                {
                                                                    bios[batch.batch] !== ""
                                                                        ? <Grid item xs={16}>
                                                                            <Option key={1} elevation={0}>
                                                                                {/* {bios[batch.batch]} */}
                                                                                The bios goes here - waiting for the API Keys
                                                                            </Option>
                                                                        </Grid> : <></>
                                                                }
                                                            </Option>
                                                        </Grid>
                                                    </Grid>
                                                </Container>
                                            </ThemeProvider>
                                            <ul className="flex justify-between mt-2">
                                                <li className="flex items-center space-x-3 text-primary-gray_colors text-sm group">
                                                    <div className="flex items-center justify-center w-9 h-9 rounded-full transform transition-colors duration-2 group-hover:bg-primary-tweets_hover_colors1 cursor-pointer">
                                                        <Reply />
                                                    </div>
                                                    <span>20</span>
                                                </li>

                                                <li className="flex items-center space-x-3 text-primary-gray_colors text-sm group">
                                                    <div className="flex items-center justify-center w-9 h-9 rounded-full transform transition-colors duration-2 group-hover:bg-primary-tweets_hover_colors2 cursor-pointer">
                                                        <Retweet />
                                                    </div>
                                                    <span>5</span>
                                                </li>

                                                <li className="flex items-center space-x-3 text-primary-gray_colors text-sm group">
                                                    <div className="flex items-center justify-center w-9 h-9 rounded-full transform transition-colors duration-2 group-hover:bg-primary-tweets_hover_colors3 cursor-pointer">
                                                        <Like />
                                                    </div>
                                                    <span>9,9K</span>
                                                </li>

                                                <li className="flex items-center space-x-3 text-primary-gray_colors text-sm group">
                                                    <div className="flex items-center justify-center w-9 h-9 rounded-full transform transition-colors duration-2 group-hover:bg-primary-tweets_hover_colors1 cursor-pointer">
                                                        <Share />
                                                    </div>
                                                    <span>2</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <br />
                                </>
                            ))}
                        </div>
                    </> : <></>
            }
            <div className="flex space-x-3 px-4 py-3 border-b border-primary-container_border_color">
                <img src="https://pbs.twimg.com/media/FDfHu8tVEAQAVfv?format=jpg&name=large" className="w-11 h-11 rounded-full" />
                <div className="flex-1">
                    <div className="flex items-center text-sm space-x-2">
                        <span className="ml-1 font-bold text-white">AdemCan Certel <VerifiedBadge /></span>
                        <span className="ml-2 text-primary-gray_colors">@CertelAdemcan</span>
                        <div className="mx-2 text-primary-gray_colors">·</div>
                        <span className="text-primary-gray_colors">1h</span>
                    </div>
                    <div className="ml-1">
                        <p className="items-center text-white overflow-hidden">
                            <span className="text-primary-tweets_hover_colors2">#ForzaHorizon5</span> Photo mode
                            <img className="mt-3 rounded-xl" src="https://pbs.twimg.com/media/FDfHu8tVEAQAVfv?format=jpg&name=large" />
                        </p>
                        <ul className="flex justify-between mt-2">
                            <li className="flex items-center space-x-3 text-primary-gray_colors text-sm group">
                                <div className="flex items-center justify-center w-9 h-9 rounded-full transform transition-colors duration-2 group-hover:bg-primary-tweets_hover_colors1 cursor-pointer">
                                    <Reply />
                                </div>
                                <span>40</span>
                            </li>

                            <li className="flex items-center space-x-3 text-primary-gray_colors text-sm group">
                                <div className="flex items-center justify-center w-9 h-9 rounded-full transform transition-colors duration-2 group-hover:bg-primary-tweets_hover_colors2 cursor-pointer">
                                    <Retweet />
                                </div>
                                <span>1</span>
                            </li>

                            <li className="flex items-center space-x-3 text-primary-gray_colors text-sm group">
                                <div className="flex items-center justify-center w-9 h-9 rounded-full transform transition-colors duration-2 group-hover:bg-primary-tweets_hover_colors3 cursor-pointer">
                                    <Like />
                                </div>
                                <span>7K</span>
                            </li>

                            <li className="flex items-center space-x-3 text-primary-gray_colors text-sm group">
                                <div className="flex items-center justify-center w-9 h-9 rounded-full transform transition-colors duration-2 group-hover:bg-primary-tweets_hover_colors1 cursor-pointer">
                                    <Share />
                                </div>
                                <span>1</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}