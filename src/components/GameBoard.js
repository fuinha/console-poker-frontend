import React from 'react';
import Players from './Players';

const importAll = r => {
    let images = {};
    r.keys().map((item) => { return images[item.replace('./', '')] = r(item); });
    return images;
}

const images = importAll(require.context('../pictures/cards', false, /\.(png|jpe?g|svg)$/));

class GameBoard extends React.Component {
    componentWillUnmount() {
        this.updateChips();
    }

    updateChips = () => {
        if (this.props.round) {
            const user = this.props.round.ordered_users.find(u => u.id === this.props.user.id);
            if (user) {
                // console.log(user.chips);
                this.props.setChips(user.chips);
            }
        }
    }

    renderBoardCards = () => (this.props.round.access_community_cards.split(" ").map((c, index) => <img key={index} className="cards" alt={c} src={images[`${c}.png`]}/>))

    renderCardsAndPot = () => {
        if (this.props.round) {
            return (
                <div id="board">
                    {this.props.round.access_community_cards === "" ? "" : this.renderBoardCards()}<br/><br/>
                    <span className="chips">
                        {this.props.round.pot}
                    </span> <i className="nes-icon coin is-small"></i>
                </div>
            )
        }
    }

    renderSitButton = () => {
        if (this.props.game.users &&
        (!this.props.game.users.count || this.props.game.users.count < 8)) {
            if (!this.props.game.users.find(u => u.username === this.props.user.username)){
                return (
                    <div className="board_user"><button onClick={() => this.props.sitDown(this.props.game.id)} className="nes-btn is-primary smaller-btn">Sit</button></div>
                )
            }
        } 
    }

    renderBoard = () => {
        if (this.props.user) {
            return ( 
                <>
                    <Players images={images}/>
                    {this.renderSitButton()}
                    {this.renderCardsAndPot()}<br/>
                </>
            )
        }
    }
    render() {
        return (
            <>
                {this.renderBoard()}
            </>
        )
    }
}

export default GameBoard;