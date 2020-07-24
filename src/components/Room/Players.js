import React from 'react';
import Player from './Player';
import { useSelector } from 'react-redux';

function Players (props) {
    const game = useSelector(state => state.game);
    const gamePlayers = useSelector(state => state.gamePlayers);

    const renderPlayers = () => {
        if (game.ordered_users) {
        // if (gamePlayers) {
            // console.log('testetestsetsetset');
            // console.log(game);
            return (
                // <div id="players_container" style={{position: "relative"}}>
                <div id="players_container">
                {/* <div> */}
                    {game.ordered_users.map((user,index) => 
                        <Player 
                            key={index} 
                            user={user} 
                            images={props.images}/>)}
                </div>
            )
        }
    }

    return(
        <ul>
            {renderPlayers()}
        </ul>
    )
}

export default Players;