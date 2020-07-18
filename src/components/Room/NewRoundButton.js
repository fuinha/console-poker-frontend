import React from 'react';
import useSound from 'use-sound';
// import shuffle from '../../sounds/shuffle.wav';
// import threeDeal from '../../sounds/three_deal.wav';
import chips from '../../sounds/chips.wav';
import newRound from '../../sounds/new_round.wav';

function NewRoundButton (props) {
    // const [playShuffle] = useSound(shuffle);
    // const [playDeal] = useSound(threeDeal);
    const [playChips] = useSound(chips);
    const [playNew] = useSound(newRound);

    const clickHandler = () => {
        props.clickHandler();
        playNew();
        playChips();
        // playShuffle();
        // setTimeout(() => playDeal(), 100);
        // playChips();
    }

    return (
        <button 
            className={`nes-btn ${props.startable ? 'is-primary' : 'is-disabled'}`}
            onClick={clickHandler}>New Round</button>
    )
}

export default NewRoundButton;