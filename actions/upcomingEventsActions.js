// app/src/actions/upcomingEventsActions.js

export const UPCOMING_EVENTS_FETCH_REQUEST = 'UPCOMING_EVENTS_FETCH_REQUEST';
export const UPCOMING_EVENTS_FETCH_SUCCESS = 'UPCOMING_EVENTS_FETCH_SUCCESS';
export const UPCOMING_EVENTS_FETCH_FAILED  = 'UPCOMING_EVENTS_FETCH_FAILED';

export const upcomingEventsFetchRequest = (params) => ({
  type: UPCOMING_EVENTS_FETCH_REQUEST,
  params, 
});

export const upcomingEventsFetchSuccess = (events) => ({
  type: UPCOMING_EVENTS_FETCH_SUCCESS,
  events,
});

export const upcomingEventsFetchFailed = (message) => ({
  type: UPCOMING_EVENTS_FETCH_FAILED,
  message,
});
