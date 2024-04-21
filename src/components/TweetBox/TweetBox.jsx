import { useState, useRef, useEffect, useCallback } from 'react';
import { Media, Gif, Survey, Emoji, Plans } from '../Sidebar/İcons';
import db from '../../config/modules/firebase';

import { Avatar, Container, Grid, IconButton, Paper, TextField, ThemeProvider, createTheme, styled } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag, useDrop } from 'react-dnd';
import { Outbound } from '@mui/icons-material';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

export default function TweetBox(props) {

    const [thread_blocks, setBlocks] = props.blocks;
    const [indices, setIndices] = props.indices;
    const [pub_blocks, setPub] = props.tweets;
    const block_buffer = useRef(thread_blocks);

    async function sendTweet() {
        let payload = [];
        for (let i = 0; i < indices.length; i++) {
            let new_block = {
                index: indices[i],
                subheader: block_buffer.current[i].subheader,
                body: block_buffer.current[i].body,
            };
            payload.push(new_block);
            console.log(`Payload: ${JSON.stringify(payload)}`)
        }
        fetch("http://127.0.0.1:5000/submit-tweet", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data["echo"]);
                let new_pub = []
                for (let block of data["echo"]) {
                    new_pub.push(block);
                }
                let new_pubs = pub_blocks;
                let new_batch = {
                    batch: pub_blocks.length === 0 ? 0 : pub_blocks[pub_blocks.length - 1].batch + 1,
                    blocks: new_pub,
                    tweet_ids: data["tweet_ids"],
                    summary: data["summary"],
                }
                new_pubs.push(new_batch);
                setPub(new_pubs);
                setIndices([1]);
                setBlocks([{
                    id: 1,
                    subheader: "",
                    body: "",
                }]);
                block_buffer.current = [{
                    id: 1,
                    subheader: "",
                    body: "",
                }];
            })
    };

    const Rectangle = styled(Paper)(({ theme }) => ({
        ...theme.typography.body2,
        textAlign: 'left',
        marginLeft: 30,
        marginBottom: 30,
        padding: 30,
        variant: 'outlined',
        fill: 'transparent',
        color: theme.palette.text.primary,
        lineHeight: '30px',
        key: indices[indices.length - 1],
    }));

    function DeleteButton(props) {
        return (
            <>
                {
                    props.index >= 1
                        ? <Container sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'right' }}>
                            <IconButton
                                sx={{ width: 40, height: 40 }}
                                onClick={() => {
                                    block_buffer.current.splice(props.index - 1, 1);
                                    setBlocks(block_buffer.current);
                                    let new_indices = [...indices];
                                    new_indices.splice(new_indices.length - 1, 1);
                                    setIndices(new_indices);
                                }}>
                                <DeleteIcon sx={{ width: '100%', height: '100%' }} />
                            </IconButton>
                        </Container> : <></>
                }
            </>
        )
    }

    return (
        <>
            <div className="flex flex-1 flex-col mt-2 text-white">
                <ThemeProvider theme={darkTheme}>
                    <Container maxWidth={'80%'} sx={{ alignSelf: 'center', marginTop: 5 }}>
                        <Grid container spacing={2} columns={12}>
                            <Grid item xs={12} key={0}>
                                {
                                    indices.map((index) => (
                                        <>
                                            <Grid item xs={12} key={index}>
                                                <Rectangle key={1} elevation={2}>
                                                    {index > 1 ? <DeleteButton index={index} /> : <></>}
                                                    <p marginLeft="30px">Thread {index}/{indices[indices.length - 1]}</p>
                                                    <TextField
                                                        fullWidth
                                                        key={`block-${index}`}
                                                        placeholder={`What's on your mind?`}
                                                        defaultValue={block_buffer.current[index - 1].subheader}
                                                        variant='standard'
                                                        onChange={(event) => {
                                                            console.log(JSON.stringify(block_buffer));
                                                            console.log(index);
                                                            let new_buffer = [...block_buffer.current];
                                                            new_buffer[index - 1].subheader = event.target.value;
                                                            block_buffer.current = new_buffer;
                                                        }}
                                                        sx={{ display: 'block', marginBottom: 2 }} />
                                                    <TextField
                                                        fullWidth
                                                        key={`block-${index}-2`}
                                                        placeholder={`Talk it about it here...`}
                                                        defaultValue={block_buffer.current[index - 1].body}
                                                        variant='standard'
                                                        onChange={(event) => {
                                                            let new_buffer = [...block_buffer.current];
                                                            new_buffer[index - 1].body = event.target.value;
                                                            block_buffer.current = new_buffer;
                                                        }}
                                                        sx={{ display: 'block', marginBottom: 2 }} />
                                                </Rectangle>
                                            </Grid>
                                        </>
                                    ))
                                }
                            </Grid>
                            <Grid item xs={11} />
                            <Grid item xs={1}>
                                <IconButton
                                    sx={{ width: 50, height: 50 }}
                                    onClick={() => {
                                        console.log(block_buffer.current);
                                        block_buffer.current = [...block_buffer.current, {
                                            index: indices[indices.length - 1],
                                            subheader: "",
                                            body: "",
                                        }]
                                        setBlocks(block_buffer.current);
                                        console.log(`Block Buffer: ${JSON.stringify(block_buffer.current)}`);
                                        console.log("Saving to blocks");
                                        setIndices([...indices, indices[indices.length - 1] + 1]);
                                    }}>
                                    <AddCircleIcon sx={{ width: '100%', height: '100%' }} />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Container>
                </ThemeProvider>
                <div className="items-center flex justify-between">
                    <div className="flex items-center justify-center">
                        <input data-v-16420b52="" type="file" id="imageInput" accept="image/*" className="file cursor-pointer" />
                        <div className="flex items-center justify-center w-9 h-9 rounded-full transform transition-colors duration-2 hover:bg-primary-tweetbox_colors_hover hover:bg-opacity-25 cursor-pointer">
                            <a title="Media">
                                <label for="imageInput">
                                    <Media />
                                </label>
                            </a>
                        </div>
                        <div className="flex items-center justify-center w-9 h-9 rounded-full transform transition-colors duration-2 hover:bg-primary-tweetbox_colors_hover hover:bg-opacity-25 cursor-pointer">
                            <a title="Gif">
                                <Gif />
                            </a>
                        </div>
                        <div className="flex items-center justify-center w-9 h-9 rounded-full transform transition-colors duration-2 hover:bg-primary-tweetbox_colors_hover hover:bg-opacity-25 cursor-pointer">
                            <a title="Survery">
                                <Survey />
                            </a>
                        </div>
                        <div className="flex items-center justify-center w-9 h-9 rounded-full transform transition-colors duration-2 hover:bg-primary-tweetbox_colors_hover hover:bg-opacity-25 cursor-pointer">
                            <a className="Emoji">
                                <Emoji />
                            </a>
                        </div>
                        <div className="flex items-center justify-center w-9 h-9 rounded-full transform transition-colors duration-2 hover:bg-primary-tweetbox_colors_hover hover:bg-opacity-25 cursor-pointer">
                            <a className="Plan">
                                <Plans />
                            </a>
                        </div>
                    </div>
                    <div className="bg-primary-button text-white rounded-full shadow-lg justify-center py-2 px-4 transform transition-colors duration-500 hover:bg-primary-button_hover">
                        <button className="button-tweet font-bold" onClick={sendTweet}>Tweet</button>
                    </div>
                </div>
            </div>
        </>
    )
}