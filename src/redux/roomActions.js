import { fetchWithToken, postWithToken } from '../utilities/fetchWithToken';
import { BASE_URL } from '../utilities/BASE_URL';

export function subscribeRoom(roomId) {
    return {
      channel: 'RoomChannel',
      room: `${roomId}`
    //   received: NEW_MESSAGE,
    }
  }
  
  export function unsubscribeRoom(roomId) {
    return {
      channel: 'RoomChannel',
      room: `${roomId}`,
      leave: true,
    }
  }
  
  export function subscribeRooms() {
    return {
      channel: 'RoomsListChannel',
      rooms: true
    }
  }

  export function unsubscribeRooms() {
    return {
      channel: 'RoomsListChannel',
      rooms: true,
      leave: true
    }
  }

  export const authenticateRoomPassword = (state, roomId, history) => {
    return dispatch => {
      postWithToken(`${BASE_URL}/rooms/${roomId}/authenticate`, state)
        .then(resp => resp.json())
        .then(json => {
          json.error ? document.getElementById(`dialog-dark-rounded-alert`).showModal() : history.push(`/rooms/${roomId}`)
        })
    }
  }

  export const createRoom = (state, history) => dispatch => {
    postWithToken(`${BASE_URL}/rooms`, state)
      .then(resp => resp.json())
      .then(json => history.replace(`/rooms/${json.id}`));
  }

  export const sendMessage = message => dispatch => {
  }