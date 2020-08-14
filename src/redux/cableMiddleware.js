import ActionCable from 'actioncable';
import { WS_URL } from '../utilities/BASE_URL';
import { playMoveSound, playGameEndSound, playStartSound, playSitSound, playTurnSound } from './playSound';
// import { postMarleyMove } from '../utilities/fetchWithToken';

export default function cableMiddleware() {
  // const cable = ActionCable.createConsumer(`ws://127.0.0.1:3001/cable?token=${localStorage.getItem('token')}`);
  const cable = ActionCable.createConsumer(`${WS_URL}/cable?token=${localStorage.getItem('token')}`);

  return ({ dispatch, getState }) => next => (action) => {
    if (typeof(action) === 'function') {
      return next(action)
    }

    const {
      channel,
      room,
      game,
      user,
      rooms,
      leave
    } = action;
    const token = localStorage.getItem('token')

    const identifier = Object.assign({}, action, { token } )

    if (!channel) {
      return next(action);
    }

    if (rooms) {
      if(leave) {
        const subscription = cable.subscriptions.subscriptions.find(sub => sub.identifier === JSON.stringify({ channel, rooms }))
        cable.subscriptions.remove(subscription);
        dispatch({ type: 'CLEAR_ROOMS' })
        return;
      }

      const received = result => {
        // console.log(result);
        switch(result.type) {
          case 'current_rooms':
            dispatch({ type: 'SET_ROOMS', rooms: result.rooms })
            break;
          case 'new_rooms':
            dispatch({ type: 'ADD_ROOM', room: result.room })
            break;
          default:
            break;
        }
      }

      return cable.subscriptions.create({ channel, rooms }, { received });

    } else if (room) {
      if(leave) {
        const subscription = cable.subscriptions.subscriptions.find(sub => sub.identifier === JSON.stringify({ channel, room, token }))
        if (subscription) cable.subscriptions.remove(subscription);
        dispatch({ type: 'DELETE_ROOM' })
        dispatch({ type: 'CLEAR_MESSAGES' })
        return;
      }

      const received = result => {
        // console.log(result)
        switch (result.type) {
            case 'current_room':
              dispatch({ type: 'SET_ROOM', room: result.room });
              break;
            case 'new_message':
              dispatch({ type: 'NEW_MESSAGE', message: result.message });
              break;
            default:
              break;
        }
      }

      const sendMessage = function(message) {
          this.perform('create_message', {
              content: message
          });
      }

      return cable.subscriptions.create( identifier, { received, sendMessage });
    }

    if (game) { // game subscription.
      if(leave) {
        const subscription = cable.subscriptions.subscriptions.find(sub => sub.identifier === JSON.stringify({ channel, game, token }))
        cable.subscriptions.remove(subscription);
        dispatch({ type: 'DELETE_GAME' })
        return;
      }

      const received = result => {
        console.log(result);
        switch (result.type) {
          case 'new_move':
            dispatch({ type: 'SET_MOVE', turn_index: result.turn_index, turn_user: result.moved_user })
            playMoveSound(result.command);
            break;
          case 'update_turn':
            dispatch({ type: 'FINISHED_MOVE' });
            dispatch({ type: 'UPDATE_TURN', turn_as_json: result.turn_as_json });
            playTurnSound(result.turn_as_json, user);
            break;
          // case 'update_game_after_move':
            // setTimeout(() => {
              // if (getState().game.active_round.is_playing) { // this is so when a person folds in between the delay the update doesn't happen.
                // dispatch({ type: 'FINISHED_MOVE' });
                // dispatch({ type: 'SET_GAME', game: result.game }); 
              // }
            // }, 1000);
            // break;
          case 'next_betting_phase':
            dispatch({ type: 'FINISHED_MOVE' });
            dispatch({ type: 'NEW_BETTING_PHASE', access_community_cards: result.access_community_cards, phase: result.phase, pot: result.pot, turn_as_json: result.turn_as_json })
            break;
          case 'game_end_by_showdown':
            dispatch({ type: 'ROUND_OVER', startable: result.startable })
            dispatch({ type: 'UPDATE_WINNERS', winner_indices: result.winner_indices, winnings: result.winnings })
            playGameEndSound(result.winner_ids[user])
            // round_over
            // update_winners
            // play end game sound
            // setTimeout(() => playGameEndSound(result.winner_ids[user]), 800);
            break;
          case 'game_end_by_fold':
            // we need to make sure round.is_playing is false
            // we need to update the chips of winner + the winnings of winner
            dispatch({ type: 'ROUND_OVER', startable: result.startable })
            dispatch({ type: 'UPDATE_WINNER', winner_index: result.winner_index, winnings: result.winnings })
            playGameEndSound(result.winner_ids[user])
            // setTimeout(() => playGameEndSound(result.winner_ids[user]), 800);
            break;
          case 'start_game':
            playStartSound();
            dispatch({ type: 'SET_GAME', game: result.game });
            break;
          case 'user_join':
            // user has joined
            // result.user
            playSitSound();
            dispatch({ type: 'USER_JOIN', startable: result.startable, user: result.user, seat_index: result.seat_index });
            break;
          case 'user_leave':
            playSitSound();
            dispatch({ type: 'USER_LEAVE', startable: result.startable, seat_index: result.seat_index })
            // dispatch({ type: 'SET_GAME', game: result.game });
            break;
          case 'round_ended_due_to_leaver':
            dispatch({ type: 'ROUND_OVER' });
            break;
          case 'subscribed':
            dispatch({ type: 'SET_GAME', game: result.game });
            // dispatch({ type: 'RESET_USER_GAME' })
            break;
          case 'unsubscribed':
            dispatch({ type: 'SET_GAME', game: result.game });
            dispatch({ type: 'RESET_USER_GAME' })
          case 'update_round':
            dispatch({type: 'UPDATE_ROUND', round: result.round })
            break;
          case 'errors':
            dispatch({type: 'GAME_ERRORS', error: result.error })
            break;
          default:
            break;
        }
      }

      return cable.subscriptions.create( { channel, game, token }, { received });
    }
  };
}