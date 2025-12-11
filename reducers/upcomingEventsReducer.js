import {
  UPCOMING_EVENTS_FETCH_REQUEST,
  UPCOMING_EVENTS_FETCH_SUCCESS,
  UPCOMING_EVENTS_FETCH_FAILED,
} from '../actions/upcomingEventsActions';

const initialState = {
  events: [],
  loading: false,
  loaded: false,
  errorMessage: '',
};

export default function upcomingEventsReducer(state = initialState, action) {
  switch (action.type) {
    case UPCOMING_EVENTS_FETCH_REQUEST:
      return {
        ...state,
        loading: true,
        errorMessage: '',
      };
    case UPCOMING_EVENTS_FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        events: action.events,
      };
    case UPCOMING_EVENTS_FETCH_FAILED:
      return {
        ...state,
        loading: false,
        errorMessage: action.message,
      };
    default:
      return state;
  }
}
